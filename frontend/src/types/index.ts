export interface Song {
	_id: string;
	title: string;
	artist: string | { fullName: string };
	artistUserId: string;
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	duration: number;
	createdAt: string;
	updatedAt: string;
	likes?: number;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
}

export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export interface ArtistInfo {
	verified: boolean;
	monthlyListeners: number;
	genres: string[];
	bio?: string;
}

export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
	artistInfo?: ArtistInfo;
	likedSongs?: string[];
	role?: "user" | "artist" | "admin";
}


