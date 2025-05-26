import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface User {
  _id: string;
  username: string;
  likedSongs: string[];
  // Thêm các trường khác nếu cần
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (userId: string, token: string) => Promise<void>;
  fetchLikedSongsOfUser: (userId: string) => Promise<any[]>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
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
  fetchLikedSongsOfUser: async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/songs/${userId}/liked-songs`);
      return response.data;
    } catch (error) {
      return [];
    }
  }
})); 