import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, likeSong, unlikeSong, getUserByClerkId } from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.post("/:userId/like/:songId", protectRoute, likeSong);
router.post("/:userId/unlike/:songId", protectRoute, unlikeSong);
router.get("/:userId", protectRoute, getUserByClerkId);

export default router;
