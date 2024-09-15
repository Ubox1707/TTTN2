import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Unauthorized: Không có Token được cung cấp" });
		}

		const decoded = jwt.verify(token, process.env.JWT_KEY);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized: Token không hợp lệ" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "Không tìm thấy User" });
		}

		req.user = user;
		next();
	} catch (err) {
		console.log("Lỗi protectRoute middleware", err.message);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};