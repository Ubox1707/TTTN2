import { generateToken } from '../utils/generateToken.js'
import User from "../models/user.js"
import bcrypt from "bcrypt"

export const signup = async (req, res) => {
	try {
		const { username, nickName, email, password } = req.body

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Sai định dạng email" })
		}

		const existingUser = await User.findOne({ username })
		if (existingUser) {
			return res.status(400).json({ error: "Username đã tồn tại" })
		}

		const existingEmail = await User.findOne({ email })
		if (existingEmail) {
			return res.status(400).json({ error: "Email này đã được sử dụng" })
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Mật khẩu phải dài hơn 6 kí tự" })
		}

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = new User({
			username,
			nickName,
			email,
			password: hashedPassword,
		})

		if (newUser) {
			generateToken(newUser._id, res)
			await newUser.save()

			res.status(201).json({
				_id: newUser._id,
				username: newUser.username,
				nickName: newUser.nickName,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			})
		} else {
			res.status(400).json({ error: "Thông tin không hợp lệ" })
		}
	} catch (error) {
		console.log("Lỗi signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" })
	}
}

export const login = async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username })
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Sai username hoặc password" })
		}

		generateToken(user._id, res)

		res.status(200).json({
			_id: user._id,
			username: user.username,
			nickName: user.nickName,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		})
	} catch (error) {
		console.log("Lỗi login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" })
	}
};

export const logout = async (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 })
		res.status(200).json({ message: "Đăng xuất thành công" })
	} catch (error) {
		console.log("Lỗi logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" })
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password")
		res.status(200).json(user)
	} catch (error) {
		console.log("Lỗi getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" })
	}
};