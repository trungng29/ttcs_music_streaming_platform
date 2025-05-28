import dotenv from "dotenv";
import mongoose from "mongoose";
import createArtistSeed from "./src/seeds/artist.seed.js";
import seedSongs from "./src/seeds/songs.js";

dotenv.config();

const runSeeds = async () => {
  try {
    // Kết nối với MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Đã kết nối với MongoDB");

    // Chạy các seed
    console.log("Đang tạo dữ liệu mẫu...");
    await createArtistSeed();
    await seedSongs();

    console.log("Đã tạo dữ liệu mẫu thành công!");
    process.exit(0);
  } catch (error) {
    console.error("Lỗi khi chạy seed:", error);
    process.exit(1);
  }
};

runSeeds(); 