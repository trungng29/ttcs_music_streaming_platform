import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

// helper function for cloudinary upload
const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
            folder: "songs",
        });
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
};

export const createSong = async (req, res, next) => {
    try {
        console.log("req.user:", req.user);
        if ( !req.files || !req.files.audioFile || !req.files.imageFile ) {
            return res.status(400).json({ message: "Please upload all files !" });
        }

        const { title, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        // Lấy user từ bảng User theo clerkId
        const user = await User.findOne({ clerkId: req.user.id });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const song = new Song({
            title,
            artist: user.fullName,
            artistId: user._id, // Lưu _id của user
            audioUrl,
            imageUrl,
            duration, 
            albumId: albumId || null,
        });

        await song.save();

        // if song belongs to an album, update the album's songs array
        if ( albumId ) {
            await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } }); 
        }

        res.status(201).json({ message: "Song created successfully", song });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);
        
        // Kiểm tra xem người dùng có phải là nghệ sĩ của bài hát không
        if (song.artistId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "Unauthorized to delete this song" });
        }

        // if song belongs to an album, update the album's songs array
        if ( song.albumId ) {
            await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });
    } catch (error) {
        console.log("Error in deleteSong", error);
        next(error);
    }
};

export const createAlbum = async (req, res, next) => {
	try {
		const { title, releaseYear } = req.body;
		const { imageFile } = req.files;

		const imageUrl = await uploadToCloudinary(imageFile);

		// Lấy user từ bảng User theo clerkId
		const user = await User.findOne({ clerkId: req.user.id });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		const album = new Album({
			title,
			artist: user.fullName,
			artistId: user._id, // Lưu _id của user
			imageUrl,
			releaseYear,
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		
		const album = await Album.findById(id);
		
		// Kiểm tra xem người dùng có phải là nghệ sĩ của album không
		if (album.artistId.toString() !== req.user.id.toString()) {
			return res.status(403).json({ message: "Unauthorized to delete this album" });
		}

		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

// Lấy danh sách người dùng
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Cập nhật vai trò người dùng
export const updateUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["user", "artist", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = role;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

// Xóa người dùng và nội dung liên quan
export const deleteUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId } = req.params;

        // Tìm người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Xóa tất cả bài hát của nghệ sĩ
        await Song.deleteMany({ artistId: userId }, { session });

        // Xóa tất cả album của nghệ sĩ
        await Album.deleteMany({ artistId: userId }, { session });

        // Xóa người dùng
        await User.findByIdAndDelete(userId, { session });

        await session.commitTransaction();
        res.status(200).json({ message: "User and associated content deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
