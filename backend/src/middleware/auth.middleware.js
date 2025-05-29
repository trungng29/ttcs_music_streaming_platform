import { clerkClient } from "@clerk/express";

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
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};
