import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Song } from "@/types";

interface Playlist {
  _id: string;
  name: string;
  userId: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

interface PlaylistStore {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoading: boolean;
  error: string | null;

  fetchPlaylists: (userId: string) => Promise<void>;
  createPlaylist: (name: string, userId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  fetchPlaylistById: (playlistId: string) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  fetchPlaylists: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/user/${userId}`);
      set({ playlists: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async (name: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/playlists", {
        name,
        userId,
        songs: [],
      });
      set((state) => ({
        playlists: [...state.playlists, response.data],
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (playlistId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      set((state) => ({
        playlists: state.playlists.filter((p) => p._id !== playlistId),
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId: string, songId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, {
        songId,
      });
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistId ? response.data : p
        ),
        currentPlaylist:
          state.currentPlaylist?._id === playlistId
            ? response.data
            : state.currentPlaylist,
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(
        `/playlists/${playlistId}/songs/${songId}`
      );
      set((state) => ({
        playlists: state.playlists.map((p) =>
          p._id === playlistId ? response.data : p
        ),
        currentPlaylist:
          state.currentPlaylist?._id === playlistId
            ? response.data
            : state.currentPlaylist,
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (playlistId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/playlists/${playlistId}`);
      set({ currentPlaylist: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
})); 