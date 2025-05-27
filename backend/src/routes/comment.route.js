import express from "express";
import { getCommentsBySongId, createComment, deleteComment, toggleLikeComment } from "../controllers/comment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Lấy danh sách comment của một bài hát
router.get("/song/:songId", getCommentsBySongId);

// Tạo comment mới (yêu cầu đăng nhập)
router.post("/", protectRoute, createComment);

// Xóa comment (yêu cầu đăng nhập)
router.delete("/:commentId", protectRoute, deleteComment);

// Like/Unlike comment (yêu cầu đăng nhập)
router.post("/:commentId/like", protectRoute, toggleLikeComment);

// Like/Unlike comment (yêu cầu đăng nhập)
// router.post("/:id/like", protectRoute, likeComment);
// router.delete("/:id/like", protectRoute, unlikeComment);

export default router;