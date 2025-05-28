import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
		likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
		role: {
			type: String,
			enum: ["user", "artist", "admin"],
			default: "user"
		},
		// Thông tin thêm cho artist
		artistInfo: {
			bio: { type: String, default: "" },
			genres: [{ type: String }],
			monthlyListeners: { type: Number, default: 0 },
			verified: { type: Boolean, default: false }
		}
	},
	{ timestamps: true } //  createdAt, updatedAt
);

export const User = mongoose.model("User", userSchema);
