import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import Comment from "../models/comment.model.js";
import { Message } from "../models/message.model.js";
import { config } from "dotenv";

config();

const clearDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Đã kết nối với database");

        // Xóa tất cả dữ liệu
        await Promise.all([
            Song.deleteMany({}),
            Album.deleteMany({}),
            User.deleteMany({}),
            Playlist.deleteMany({}),
            Comment.deleteMany({}),
            Message.deleteMany({})
        ]);

        console.log("Đã xóa tất cả dữ liệu thành công!");
    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
    } finally {
        await mongoose.connection.close();
    }
};

clearDatabase(); 