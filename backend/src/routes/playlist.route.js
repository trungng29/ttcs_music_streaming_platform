import { Router } from "express";
import {
  createPlaylist,
  getPlaylistsByUser,
  getPlaylistById,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

// Lấy tất cả playlist của user
router.get("/user/:userId", protectRoute, getPlaylistsByUser);
// Tạo playlist mới
router.post("/", protectRoute, createPlaylist);
// Lấy chi tiết 1 playlist
router.get("/:id", protectRoute, getPlaylistById);
// Xóa playlist
router.delete("/:id", protectRoute, deletePlaylist);
// Thêm bài hát vào playlist
router.post("/:id/songs", protectRoute, addSongToPlaylist);
// Xóa bài hát khỏi playlist
router.delete("/:id/songs/:songId", protectRoute, removeSongFromPlaylist);

export default router; 