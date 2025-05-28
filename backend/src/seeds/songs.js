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

const songs = [
	{
		title: "Stay With Me",
		artist: "Sarah Mitchell",
		imageUrl: "/cover-images/1.jpg",
		audioUrl: "/songs/1.mp3",
		duration: 46, // 0:46
	},
	{
		title: "Midnight Drive",
		artist: "The Wanderers",
		imageUrl: "/cover-images/2.jpg",
		audioUrl: "/songs/2.mp3",
		duration: 41, // 0:41
	},
	{
		title: "Lost in Tokyo",
		artist: "Electric Dreams",
		imageUrl: "/cover-images/3.jpg",
		audioUrl: "/songs/3.mp3",
		duration: 24, // 0:24
	},
	{
		title: "Summer Daze",
		artist: "Coastal Kids",
		imageUrl: "/cover-images/4.jpg",
		audioUrl: "/songs/4.mp3",
		duration: 24, // 0:24
	},
	{
		title: "Neon Lights",
		artist: "Night Runners",
		imageUrl: "/cover-images/5.jpg",
		audioUrl: "/songs/5.mp3",
		duration: 36, // 0:36
	},
	{
		title: "Mountain High",
		artist: "The Wild Ones",
		imageUrl: "/cover-images/6.jpg",
		audioUrl: "/songs/6.mp3",
		duration: 40, // 0:40
	},
	{
		title: "City Rain",
		artist: "Urban Echo",
		imageUrl: "/cover-images/7.jpg",
		audioUrl: "/songs/7.mp3",
		duration: 39, // 0:39
	},
	{
		title: "Desert Wind",
		artist: "Sahara Sons",
		imageUrl: "/cover-images/8.jpg",
		audioUrl: "/songs/8.mp3",
		duration: 28, // 0:28
	},
	{
		title: "Ocean Waves",
		artist: "Coastal Drift",
		imageUrl: "/cover-images/9.jpg",
		audioUrl: "/songs/9.mp3",
		duration: 28, // 0:28
	},
	{
		title: "Starlight",
		artist: "Luna Bay",
		imageUrl: "/cover-images/10.jpg",
		audioUrl: "/songs/10.mp3",
		duration: 30, // 0:30
	},
	{
		title: "Winter Dreams",
		artist: "Arctic Pulse",
		imageUrl: "/cover-images/11.jpg",
		audioUrl: "/songs/11.mp3",
		duration: 29, // 0:29
	},
	{
		title: "Purple Sunset",
		artist: "Dream Valley",
		imageUrl: "/cover-images/12.jpg",
		audioUrl: "/songs/12.mp3",
		duration: 17, // 0:17
	},
	{
		title: "Neon Dreams",
		artist: "Cyber Pulse",
		imageUrl: "/cover-images/13.jpg",
		audioUrl: "/songs/13.mp3",
		duration: 39, // 0:39
	},
	{
		title: "Moonlight Dance",
		artist: "Silver Shadows",
		imageUrl: "/cover-images/14.jpg",
		audioUrl: "/songs/14.mp3",
		duration: 27, // 0:27
	},
	{
		title: "Urban Jungle",
		artist: "City Lights",
		imageUrl: "/cover-images/15.jpg",
		audioUrl: "/songs/15.mp3",
		duration: 36, // 0:36
	},
	{
		title: "Crystal Rain",
		artist: "Echo Valley",
		imageUrl: "/cover-images/16.jpg",
		audioUrl: "/songs/16.mp3",
		duration: 39, // 0:39
	},
	{
		title: "Neon Tokyo",
		artist: "Future Pulse",
		imageUrl: "/cover-images/17.jpg",
		audioUrl: "/songs/17.mp3",
		duration: 39, // 0:39
	},
	{
		title: "Midnight Blues",
		artist: "Jazz Cats",
		imageUrl: "/cover-images/18.jpg",
		audioUrl: "/songs/18.mp3",
		duration: 29, // 0:29
	},
];

export const seedSongs = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing songs
		await Song.deleteMany({});

		// Thêm artistId vào mỗi bài hát
		const songsWithArtistId = songs.map(song => {
			const artistId = artistIdMap[song.artist];
			if (!artistId) {
				throw new Error(`Không tìm thấy artistId cho nghệ sĩ: ${song.artist}`);
			}
			return {
				...song,
				artistId,
				plays: Math.floor(Math.random() * 5000)
			};
		});

		// Insert new songs
		await Song.insertMany(songsWithArtistId);
		console.log("Songs seeded successfully!");
	} catch (error) {
		console.error("Error seeding songs:", error);
		throw error;
	} finally {
		mongoose.connection.close();
	}
};

seedSongs();
