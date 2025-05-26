import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, getSongsByTitle, getSongById } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getLikedSongsOfUser } from "../controller/user.controller.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured", protectRoute, getFeaturedSongs);
router.get("/made-for-you", protectRoute, getMadeForYouSongs);
router.get("/trending", protectRoute, getTrendingSongs);
router.get("/search", protectRoute, getSongsByTitle);
router.get("/:id", protectRoute, getSongById);
router.get("/:userId/liked-songs", protectRoute, getLikedSongsOfUser);

export default router;
