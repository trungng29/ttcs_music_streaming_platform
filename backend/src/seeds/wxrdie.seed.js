import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { config } from "dotenv";

config();

const wxrdieData = {
    fullName: "Wxrdie",
    imageUrl: "https://i.scdn.co/image/ab6761610000e5ebc4a0c1c0c0c0c0c0c0c0c0c0", // URL ảnh thật của Wxrdie
    clerkId: "wxrdie_artist", // ID này sẽ được thay thế bằng ID thật từ Clerk
    role: "artist",
    artistInfo: {
        bio: "Wxrdie là một nghệ sĩ underground hip-hop đến từ Việt Nam. Với phong cách rap độc đáo và những câu chuyện đời thực, Wxrdie đã tạo nên một dấu ấn riêng trong cộng đồng hip-hop Việt.",
        genres: ["Hip Hop", "Rap", "Underground"],
        monthlyListeners: 50000,
        verified: true
    }
};

const seedWxrdie = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Đã kết nối với database");

        // Kiểm tra xem Wxrdie đã tồn tại chưa
        const existingWxrdie = await User.findOne({ fullName: "Wxrdie" });
        if (existingWxrdie) {
            console.log("Wxrdie đã tồn tại trong database");
            return;
        }

        // Tạo user Wxrdie
        const wxrdie = await User.create(wxrdieData);
        console.log("Đã tạo Wxrdie thành công:", wxrdie);

    } catch (error) {
        console.error("Lỗi khi tạo Wxrdie:", error);
    } finally {
        await mongoose.connection.close();
    }
};

seedWxrdie(); 