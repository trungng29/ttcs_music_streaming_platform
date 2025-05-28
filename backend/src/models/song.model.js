import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		artist: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		audioUrl: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		plays: {
			type: Number,
			default: 0,
		},
		artistId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist",
			required: true,
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
		},
	},
	{ timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
