import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const artists = [
	"Urban Echo",
	"Night Runners",
	"City Lights",
	"Cyber Pulse",
	"Coastal Kids",
	"Coastal Drift",
	"Echo Valley",
	"Luna Bay",
	"Sarah Mitchell",
	"The Wanderers",
	"Silver Shadows",
	"Electric Dreams",
	"Future Pulse",
	"Dream Valley",
	"The Wild Ones",
	"Sahara Sons",
	"Arctic Pulse",
	"Jazz Cats"
];

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

// Hàm lấy ngẫu nhiên một artistId từ mảng
const getRandomArtistId = () => {
	const randomIndex = Math.floor(Math.random() * artists.length);
	const randomArtist = artists[randomIndex];
	return artistIdMap[randomArtist];
};

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// First, create all songs
		const createdSongs = await Song.insertMany([
			{
				title: "City Rain",
				artist: "Urban Echo",
				imageUrl: "/cover-images/7.jpg",
				audioUrl: "/songs/7.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
				artistId: artistIdMap["Urban Echo"]
			},
			{
				title: "Neon Lights",
				artist: "Night Runners",
				imageUrl: "/cover-images/5.jpg",
				audioUrl: "/songs/5.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 36, // 0:36
				artistId: artistIdMap["Night Runners"]
			},
			{
				title: "Urban Jungle",
				artist: "City Lights",
				imageUrl: "/cover-images/15.jpg",
				audioUrl: "/songs/15.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 36, // 0:36
				artistId: artistIdMap["City Lights"]
			},
			{
				title: "Neon Dreams",
				artist: "Cyber Pulse",
				imageUrl: "/cover-images/13.jpg",
				audioUrl: "/songs/13.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
				artistId: artistIdMap["Cyber Pulse"]
			},
			{
				title: "Summer Daze",
				artist: "Coastal Kids",
				imageUrl: "/cover-images/4.jpg",
				audioUrl: "/songs/4.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 24, // 0:24
				artistId: artistIdMap["Coastal Kids"]
			},
			{
				title: "Ocean Waves",
				artist: "Coastal Drift",
				imageUrl: "/cover-images/9.jpg",
				audioUrl: "/songs/9.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 28, // 0:28
				artistId: artistIdMap["Coastal Drift"]
			},
			{
				title: "Crystal Rain",
				artist: "Echo Valley",
				imageUrl: "/cover-images/16.jpg",
				audioUrl: "/songs/16.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
				artistId: artistIdMap["Echo Valley"]
			},
			{
				title: "Starlight",
				artist: "Luna Bay",
				imageUrl: "/cover-images/10.jpg",
				audioUrl: "/songs/10.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 30, // 0:30
				artistId: artistIdMap["Luna Bay"]
			},
			{
				title: "Stay With Me",
				artist: "Sarah Mitchell",
				imageUrl: "/cover-images/1.jpg",
				audioUrl: "/songs/1.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 46, // 0:46
				artistId: artistIdMap["Sarah Mitchell"]
			},
			{
				title: "Midnight Drive",
				artist: "The Wanderers",
				imageUrl: "/cover-images/2.jpg",
				audioUrl: "/songs/2.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 41, // 0:41
				artistId: artistIdMap["The Wanderers"]
			},
			{
				title: "Moonlight Dance",
				artist: "Silver Shadows",
				imageUrl: "/cover-images/14.jpg",
				audioUrl: "/songs/14.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 27, // 0:27
				artistId: artistIdMap["Silver Shadows"]
			},
			{
				title: "Lost in Tokyo",
				artist: "Electric Dreams",
				imageUrl: "/cover-images/3.jpg",
				audioUrl: "/songs/3.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 24, // 0:24
				artistId: artistIdMap["Electric Dreams"]
			},
			{
				title: "Neon Tokyo",
				artist: "Future Pulse",
				imageUrl: "/cover-images/17.jpg",
				audioUrl: "/songs/17.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 39, // 0:39
				artistId: artistIdMap["Future Pulse"]
			},
			{
				title: "Purple Sunset",
				artist: "Dream Valley",
				imageUrl: "/cover-images/12.jpg",
				audioUrl: "/songs/12.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 17, // 0:17
				artistId: artistIdMap["Dream Valley"]
			},
		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "Urban Nights",
				artist: getRandomArtistId(),
				artistId: getRandomArtistId(),
				imageUrl: "/albums/1.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(0, 4).map((song) => song._id),
			},
			{
				title: "Coastal Dreaming",
				artist: getRandomArtistId(),
				artistId: getRandomArtistId(),
				imageUrl: "/albums/2.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(4, 8).map((song) => song._id),
			},
			{
				title: "Midnight Sessions",
				artist: getRandomArtistId(),
				artistId: getRandomArtistId(),
				imageUrl: "/albums/3.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(8, 11).map((song) => song._id),
			},
			{
				title: "Eastern Dreams",
				artist: getRandomArtistId(),
				artistId: getRandomArtistId(),
				imageUrl: "/albums/4.jpg",
				releaseYear: 2024,
				songs: createdSongs.slice(11, 14).map((song) => song._id),
			},
		];

		// Insert all albums
		const createdAlbums = await Album.insertMany(albums);

		// Update songs with their album references
		for (let i = 0; i < createdAlbums.length; i++) {
			const album = createdAlbums[i];
			const albumSongs = albums[i].songs;

			await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
		}

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedDatabase();
