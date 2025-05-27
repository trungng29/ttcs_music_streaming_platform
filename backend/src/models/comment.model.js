import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  songId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  parentId: { type: String, default: null },
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment; 