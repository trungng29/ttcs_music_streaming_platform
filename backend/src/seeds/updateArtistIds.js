import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const artistIdMap = {
    "Urban Echo": "68374612cad1e43c1b47ebd2",
    "Night Runners": "68374612cad1e43c1b47ebd3",
    "City Lights": "68374612cad1e43c1b47ebd4",
    "Cyber Pulse": "68374612cad1e43c1b47ebd5",
    "Coastal Kids": "68374612cad1e43c1b47ebd6",
    "Coastal Drift": "68374612cad1e43c1b47ebd7",
    "Echo Valley": "68374612cad1e43c1b47ebd8",
    "Luna Bay": "68374612cad1e43c1b47ebd9",
    "Sarah Mitchell": "68374612cad1e43c1b47ebda",
    "The Wanderers": "68374612cad1e43c1b47ebdb",
    "Silver Shadows": "68374612cad1e43c1b47ebdc",
    "Electric Dreams": "68374612cad1e43c1b47ebdd",
    "Future Pulse": "68374612cad1e43c1b47ebde",
    "Dream Valley": "68374612cad1e43c1b47ebdf",
    "The Wild Ones": "68374612cad1e43c1b47ebe0",
    "Sahara Sons": "68374612cad1e43c1b47ebe1",
    "Arctic Pulse": "68374612cad1e43c1b47ebe2",
    "Jazz Cats": "68374612cad1e43c1b47ebe3"
};

const updateArtistIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Đã kết nối với database");

        // Lấy tất cả bài hát
        const songs = await Song.find({});
        console.log(`Tìm thấy ${songs.length} bài hát`);

        // Cập nhật artistId cho từng bài hát
        for (const song of songs) {
            const artistId = artistIdMap[song.artist];
            if (artistId) {
                await Song.updateOne(
                    { _id: song._id },
                    { $set: { artistId: artistId } }
                );
                console.log(`Đã cập nhật artistId cho bài hát: ${song.title}`);
            } else {
                console.error(`Không tìm thấy artistId cho nghệ sĩ: ${song.artist}`);
            }
        }

        console.log("Hoàn thành việc cập nhật artistId!");
    } catch (error) {
        console.error("Lỗi khi cập nhật artistId:", error);
    } finally {
        await mongoose.connection.close();
    }
};

updateArtistIds(); 