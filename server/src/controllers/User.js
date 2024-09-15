import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import io from "../../index.js";

import Notification from "../models/notification.js";
import User from "../models/user.js";



export const getUserProfile = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ error: "Không tìm thấy User" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Lỗi getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "Bạn không thể follow/unfollow chính bạn" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "Không tìm thấy User" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow 
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "Unfollow thành công" });
		} else {
			// Follow 
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Notification 
			const newNotification = new Notification({
				from: req.user._id,
				to: userToModify._id,
				type: "follow",
			});

			await newNotification.save();

			io.emit("get-notification", {
				from: { _id: req.user._id, username: currentUser.username, profileImg: currentUser.profileImg },
				type: "follow",
				to: userToModify._id,
			});


			res.status(200).json({ message: "Follow thành công" });
		}
	} catch (error) {
		console.log("Lỗi followUnfollowUser controller: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		//Giới hạn số lượng gợi ý follow
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Lỗi getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const updateUser = async (req, res) => {
	const { username, nickName , email, currentPassword, newPassword, workAt, liveIn } = req.body;
	let { profileImg, coverImg } = req.body;

	const userId = req.user._id;

	try {
		let user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "Không tìm thấy User" });

		if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
			return res.status(400).json({ error: "Vui lòng nhập mật khẩu cũ và mật khẩu mới" });
		}

		if (currentPassword && newPassword) {
			const isMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isMatch) return res.status(400).json({ error: "Mật khẩu cũ không trùng khớp" });
			if (newPassword.length < 6) {
				return res.status(400).json({ error: "Mật khẩu phải dài hơn 6 kí tự" });
			}

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(newPassword, salt);
		}

		if (profileImg) {
			if (user.profileImg) {
				// Lấy tên tệp hình ảnh
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				// Lấy tên tệp hình ảnh
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}

        user.username = username || user.username;
		user.nickName = nickName || user.nickName;
		user.email = email || user.email;
		user.workAt = workAt || user.workAt;
		user.liveIn = liveIn || user.liveIn;
		user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

		user = await user.save();

		// Trả về mật khẩu rỗng để bảo mật
		user.password = null;

		return res.status(200).json(user);
	} catch (error) {
		console.log("Lỗi updateUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};