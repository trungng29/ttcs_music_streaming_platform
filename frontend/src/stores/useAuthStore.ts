import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
  isAdmin: boolean;
  isArtist: boolean;
  role: string;
  userId: string;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isArtist: false,
  role: "user",
  userId: "",
  isLoading: false,
  error: null,

  checkAdminStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/check");
      set({
        isAdmin: response.data.admin,
        isArtist: response.data.artist,
        role: response.data.role,
        userId: response.data.userId
      });
    } catch (error: any) {
      set({ 
        isAdmin: false, 
        isArtist: false,
        role: "user",
        userId: "",
        error: error.response.data.message 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({ 
      isAdmin: false, 
      isArtist: false,
      role: "user",
      userId: "",
      isLoading: false, 
      error: null 
    });
  },
}));
