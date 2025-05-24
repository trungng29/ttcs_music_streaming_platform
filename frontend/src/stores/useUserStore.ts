import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface User {
  _id: string;
  likedSongs: string[];
  // Thêm các trường khác nếu cần
}

interface UserStore {
  user: User | null;
  fetchUser: (userId: string, token: string) => Promise<void>;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  fetchUser: async (userId: string, token: string) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: res.data });
    } catch (error: any) {
      console.error("Error fetching user:", error);
      throw new Error(error.response?.data?.message || "Không thể lấy thông tin người dùng");
    }
  },
  setUser: (user: User) => set({ user }),
})); 