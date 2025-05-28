import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";

interface UserStore {
  user: User | null;
  currentArtist: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (userId: string, token: string) => Promise<void>;
  fetchArtist: (artistId: string) => Promise<void>;
  fetchLikedSongsOfUser: (userId: string) => Promise<any[]>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  currentArtist: null,
  isLoading: false,
  error: null,
  fetchUser: async (userId: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchArtist: async (artistId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/artists/${artistId}`);
      set({ currentArtist: response.data });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchLikedSongsOfUser: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/songs/${userId}/liked-songs`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
})); 