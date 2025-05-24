import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const likeSong = async (req, res, next) => {
	try {
	  const { userId, songId } = req.params;
	  console.log("Like song request:", { userId, songId });
	  const user = await User.findOne({ clerkId: userId });
	  console.log("Found user:", user);
	  if (!user) return res.status(404).json({ message: "User not found" });
  
	  if (!user.likedSongs.includes(songId)) {
		user.likedSongs.push(songId);
		await user.save();
	  }
	  res.json(user.likedSongs);
	} catch (error) {
	  console.error("Like song error:", error);
	  next(error);
	}
  };
  
export const unlikeSong = async (req, res, next) => {
	try {
		const { userId, songId } = req.params;
		console.log("Unlike song request:", { userId, songId });
		const user = await User.findOne({ clerkId: userId });
		console.log("Found user:", user);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
		await user.save();
		res.json(user.likedSongs);
	} catch (error) {
		console.error("Unlike song error:", error);
		next(error);
	}
};

export const getUserByClerkId = async (req, res, next) => {
	try {
	  const { userId } = req.params;
	  const user = await User.findOne({ clerkId: userId });
	  if (!user) {
		return res.status(404).json({ message: "User not found" });
	  }
	  res.json(user);
	} catch (error) {
	  next(error);
	}
  };
