import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const getAllSongs = async (req, res, next) => {
	try {
		// -1 = Descending => newest -> oldest
		// 1 = Ascending => oldest -> newest
		const songs = await Song.find().sort({ createdAt: -1 });
		const songsWithArtistUserId = songs.map(song => ({
			...song.toObject(),
			artistUserId: song.artistId,
		}));
		res.json(songsWithArtistUserId);
	} catch (error) {
		next(error);
	}
};

export const getSongById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);
		
		if (!song) {
			return res.status(404).json({ message: "Không tìm thấy bài hát" });
		}

		// Lấy user theo clerkId (artistId trong song)
		let artistUserId = undefined;
		if (song.artistId) {
			const user = await User.findOne({ clerkId: song.artistId });
			if (user) {
				artistUserId = user._id;
			}
		}

		res.json({
			...song.toObject(),
			artistUserId,
		});
	} catch (error) {
		next(error);
	}
};

export const getFeaturedSongs = async (req, res, next) => {
	try {
		// fetch 6 random songs using mongodb's aggregation pipeline
		const songs = await Song.aggregate([
			{
				$sample: { size: 6 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					artistId: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		const songsWithArtistUserId = songs.map(song => ({
			...song,
			artistUserId: song.artistId,
		}));
		res.json(songsWithArtistUserId);
	} catch (error) {
		next(error);
	}
};

export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					artistId: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		const songsWithArtistUserId = songs.map(song => ({
			...song,
			artistUserId: song.artistId,
		}));
		res.json(songsWithArtistUserId);
	} catch (error) {
		next(error);
	}
};

export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					artistId: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		const songsWithArtistUserId = songs.map(song => ({
			...song,
			artistUserId: song.artistId,
		}));
		res.json(songsWithArtistUserId);
	} catch (error) {
		next(error);
	}
};

export const getSongsByTitle = async (req, res, next) => {
	try {
		const { title } = req.query;

		if (!title) {
			return res.status(400).json({ message: "Vui lòng nhập tên bài hát" });
		}

		// Tìm kiếm bài hát có title chứa chuỗi tìm kiếm (không phân biệt hoa thường)
		const songs = await Song.find({
			title: { $regex: title, $options: 'i' }
		}).sort({ createdAt: -1 });

		const songsWithArtistUserId = songs.map(song => ({
			...song.toObject(),
			artistUserId: song.artistId,
		}));
		res.json(songsWithArtistUserId);
	} catch (error) {
		next(error);
	}
};
