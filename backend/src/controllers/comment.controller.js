import Comment from "../models/comment.model.js";
import { clerkClient } from "@clerk/express";

// Lấy danh sách comment của một bài hát
export const getCommentsBySongId = async (req, res) => {
  try {
    const { songId } = req.params;
    // KHÔNG filter parentId, lấy toàn bộ comment của bài hát
    const comments = await Comment.find({ songId }).sort({ createdAt: -1 });

    // Lấy tất cả userId duy nhất
    const userIds = [...new Set(comments.map((c) => c.userId))];
    // Lấy thông tin user từ Clerk
    const userMap = {};
    for (const userId of userIds) {
      try {
        const user = await clerkClient.users.getUser(userId);
        userMap[userId] = {
          username: user.username || user.firstName || user.emailAddresses?.[0]?.emailAddress || "Ẩn danh",
          avatarUrl: user.imageUrl || undefined,
        };
      } catch (err) {
        userMap[userId] = {
          username: "Ẩn danh",
          avatarUrl: undefined,
        };
      }
    }

    const transformedComments = comments.map((comment) => ({
      _id: comment._id,
      content: comment.content,
      userId: comment.userId,
      songId: comment.songId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      likes: comment.likes,
      user: userMap[comment.userId] || { username: "Ẩn danh" },
    }));

    res.json(transformedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bình luận" });
  }
};

// Tạo comment mới
export const createComment = async (req, res) => {
  try {
    const { content, songId, parentId } = req.body;
    const userId = req.user.id;

    const comment = await Comment.create({
      content,
      userId,
      songId,
      parentId,
    });

    // Lấy thông tin user từ Clerk
    let userInfo = { username: "Ẩn danh" };
    try {
      const user = await clerkClient.users.getUser(userId);
      userInfo = {
        username: user.username || user.firstName || user.emailAddresses?.[0]?.emailAddress || "Ẩn danh",
        avatarUrl: user.imageUrl || undefined,
      };
    } catch (err) {
      // fallback giữ nguyên Ẩn danh
    }

    const transformedComment = {
      _id: comment._id,
      content: comment.content,
      userId: comment.userId,
      songId: comment.songId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      likes: [],
      user: userInfo,
    };

    res.status(201).json(transformedComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Lỗi khi tạo bình luận" });
  }
};

// Xóa comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Không có quyền xóa bình luận này" });
    }

    // Xóa tất cả comment con
    await Comment.deleteMany({ parentId: commentId });
    await comment.deleteOne();

    res.json({ message: "Đã xóa bình luận thành công" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Lỗi khi xóa bình luận" });
  }
};

// Like/Unlike comment
export const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    const isLiked = comment.likes.includes(userId);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    // Trả về object comment mới nhất, bao gồm likes
    res.json({
      message: isLiked ? "Đã bỏ thích bình luận" : "Đã thích bình luận",
      likes: comment.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Lỗi khi thao tác với bình luận" });
  }
}; 