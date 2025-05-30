import { clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		req.user = {
			id: req.auth.userId,
			fullName: currentUser.firstName && currentUser.lastName
				? `${currentUser.firstName} ${currentUser.lastName}`
				: currentUser.username || currentUser.emailAddress || "Unknown"
		};
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized - cannot fetch user info" });
	}
};

export const requireAdmin = async (req, res, next) => {
	try {
		// Tìm user trong database theo clerkId
		const user = await User.findOne({ clerkId: req.auth.userId });
		
		if (!user || (user.role !== "admin" && user.role !== "artist")) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin or artist" });
		}

		// Lưu thông tin user vào request để sử dụng ở các controller
		req.user = {
			...req.user,
			role: user.role,
			userId: user._id
		};

		next();
	} catch (error) {
		next(error);
	}
};
