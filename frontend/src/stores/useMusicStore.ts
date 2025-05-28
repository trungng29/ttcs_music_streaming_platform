import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@clerk/clerk-react";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	currentSong: Song | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;
	artistSongs: Song[];
	artistAlbums: Album[];

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchSongById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	fetchSongsByIds: (ids: string[]) => Promise<void>;
	fetchArtistSongs: (artistId: string) => Promise<void>;
	fetchArtistAlbums: (artistId: string) => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	likeSong: (token: string, songId: string) => Promise<void>;
	unlikeSong: (token: string, songId: string) => Promise<void>;
	setCurrentSong: (song: Song) => void;
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	currentSong: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	artistSongs: [],
	artistAlbums: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	setCurrentSong: (song: Song) => {
		set({ currentSong: song });
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/${id}`);
			set({ currentSong: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongsByIds: async (ids: string[]) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post("/songs/by-ids", { ids });
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchArtistSongs: async (artistId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/artists/${artistId}/songs`);
			set({ artistSongs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchArtistAlbums: async (artistId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/artists/${artistId}/albums`);
			set({ artistAlbums: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	likeSong: async (token: string, songId: string) => {
		try {
			const decoded: any = jwtDecode(token);
			const userId = decoded.sub; // ClerkId
			const response = await axiosInstance.post(
				`/users/${userId}/like/${songId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return response.data;
		} catch (error: any) {
			console.error("Like song error:", error);
			throw new Error(error.response?.data?.message || "Không thể thích bài hát");
		}
	},

	unlikeSong: async (token: string, songId: string) => {
		try {
			const decoded: any = jwtDecode(token);
			const userId = decoded.sub; // ClerkId
			const response = await axiosInstance.post(
				`/users/${userId}/unlike/${songId}`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return response.data;
		} catch (error: any) {
			console.error("Unlike song error:", error);
			throw new Error(error.response?.data?.message || "Không thể bỏ thích bài hát");
		}
	},
}));
