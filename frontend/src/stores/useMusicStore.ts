import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];               // Danh sách bài hát
  albums: Album[];             // Danh sách album
  isLoading: boolean;          // Cờ báo đang tải dữ liệu hay không
  error: string | null;        // Thông báo lỗi nếu có
  currentAlbum: Album | null;  // Album đang được chọn

  fetchAlbums: () => Promise<void>;               // Hàm fetch tất cả album
  fetchAlbumById: (id: string) => Promise<void>;  // Hàm fetch album theo id
}

export const useMusicStore = create<MusicStore>((set) => ({
  // Giá trị khởi tạo cho state
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  // Khi ứng dụng bắt đầu, chưa có bài hát nào, chưa có album nào, chưa xảy ra lỗi gì.

  fetchAlbums: async () => {
    // Đầu tiên set isLoading: true, xoá lỗi cũ (nếu có)
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
}));
