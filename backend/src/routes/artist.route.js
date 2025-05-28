import express from "express";
import { 
  getArtistById, 
  getArtistSongs, 
  getArtistAlbums, 
  updateArtist,
  getFeaturedArtists 
} from "../controllers/artist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Lấy thông tin nghệ sĩ
router.get("/:id", getArtistById);

// Lấy danh sách bài hát của nghệ sĩ
router.get("/:artistId/songs", getArtistSongs);

// Lấy danh sách album của nghệ sĩ
router.get("/:artistId/albums", getArtistAlbums);

// Cập nhật thông tin nghệ sĩ (yêu cầu đăng nhập)
router.put("/:id", protectRoute, updateArtist);

// Lấy danh sách nghệ sĩ nổi bật
router.get("/featured", getFeaturedArtists);

export default router; 