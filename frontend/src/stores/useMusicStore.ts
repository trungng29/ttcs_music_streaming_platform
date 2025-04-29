import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface MusicStore {
  songs: any[]; // Replace with actual type
  albums: any[]; // Replace with actual type
  isLoading: boolean;
  error: string | null; // Error message if any

  fetchAlbums: () => Promise<void>; // Function to fetch albums
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,

  fetchAlbums: async () => {
    // data fetch logic...
    set({
      isLoading: true,
      error: null,
    });
    try {
      const response = await axiosInstance.get("/albums");
      set({
        albums: response.data,
      });
    } catch (error: any) {
      set({
        error: error.response.data.message,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
