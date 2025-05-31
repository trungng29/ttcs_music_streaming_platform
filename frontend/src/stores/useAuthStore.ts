import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthStore {
  isAdmin: boolean;
  isArtist: boolean;
  role: string;
  userId: string;
  isLoading: boolean;
  error: string | null;

  checkAdminStatus: (token: string) => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAdmin: false,
  isArtist: false,
  role: "user",
  userId: "",
  isLoading: false,
  error: null,

  checkAdminStatus: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!token) {
        throw new Error("No token available");
      }

      // Kiểm tra token hết hạn
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      // Cập nhật token vào axios
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
        error: error.response?.data?.message || error.message
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
