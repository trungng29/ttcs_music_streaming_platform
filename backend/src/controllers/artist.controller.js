import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

// Lấy thông tin nghệ sĩ
export const getArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await User.findById(id);

    if (!artist) {
      return res.status(404).json({ message: "Không tìm thấy nghệ sĩ" });
    }

    res.json(artist);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách bài hát của nghệ sĩ
export const getArtistSongs = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const songs = await Song.find({ artistId }).sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách album của nghệ sĩ
export const getArtistAlbums = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const albums = await Album.find({ artist: artistId }).sort({ createdAt: -1 });
    res.json(albums);
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin nghệ sĩ
export const updateArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bio, genres, monthlyListeners, verified } = req.body;

    const artist = await User.findById(id);
    if (!artist) {
      return res.status(404).json({ message: "Không tìm thấy nghệ sĩ" });
    }

    // Kiểm tra xem người dùng có phải là nghệ sĩ không
    if (!artist.artistInfo) {
      return res.status(400).json({ message: "Người dùng này không phải là nghệ sĩ" });
    }

    // Cập nhật thông tin nghệ sĩ
    artist.artistInfo = {
      ...artist.artistInfo,
      bio: bio || artist.artistInfo.bio,
      genres: genres || artist.artistInfo.genres,
      monthlyListeners: monthlyListeners || artist.artistInfo.monthlyListeners,
      verified: verified !== undefined ? verified : artist.artistInfo.verified,
    };

    await artist.save();
    res.json(artist);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách nghệ sĩ nổi bật
export const getFeaturedArtists = async (req, res, next) => {
  try {
    const artists = await User.find({ 
      "artistInfo.verified": true 
    })
    .sort({ "artistInfo.monthlyListeners": -1 })
    .limit(10);

    res.json(artists);
  } catch (error) {
    next(error);
  }
}; 