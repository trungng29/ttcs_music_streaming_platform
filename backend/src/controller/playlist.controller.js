import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: "Thiếu tên hoặc userId" });
    }
    const playlist = await Playlist.create({ name, userId, songs: [] });
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 }).populate("songs");
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "Không tìm thấy playlist" });
    }
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findByIdAndDelete(id);
    if (!playlist) {
      return res.status(404).json({ message: "Không tìm thấy playlist" });
    }
    res.json({ message: "Đã xóa playlist" });
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params; // playlistId
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: "Thiếu songId" });
    const song = await Song.findById(songId);
    if (!song) return res.status(404).json({ message: "Không tìm thấy bài hát" });
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Không tìm thấy playlist" });
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    const updated = await Playlist.findById(id).populate("songs");
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Không tìm thấy playlist" });
    playlist.songs = playlist.songs.filter(sid => sid.toString() !== songId);
    await playlist.save();
    const updated = await Playlist.findById(id).populate("songs");
    res.json(updated);
  } catch (error) {
    next(error);
  }
}; 