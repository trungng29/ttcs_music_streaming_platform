import { create } from "zustand";
import { Comment, CreateCommentData } from "@/types/comment.types";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

interface CommentStore {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  fetchComments: (songId: string, parentId?: string) => Promise<void>;
  createComment: (data: CreateCommentData, token: string) => Promise<void>;
  deleteComment: (commentId: string, token: string) => Promise<void>;
  toggleLikeComment: (commentId: string, token: string) => Promise<void>;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchComments: async (songId: string, parentId?: string) => {
    try {
      set({ isLoading: true, error: null });
      const queryParams = parentId ? `?parentId=${parentId}` : "";
      const response = await axiosInstance.get(`/comments/song/${songId}${queryParams}`);
      set({ comments: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: "Lỗi khi tải bình luận", isLoading: false });
      toast.error("Không thể tải bình luận");
    }
  },

  createComment: async (data: CreateCommentData, token: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.post("/comments", data);
      set((state) => ({
        comments: [response.data, ...state.comments],
        isLoading: false,
      }));
      toast.success("Đã đăng bình luận thành công");
    } catch (error: any) {
      set({ error: "Lỗi khi đăng bình luận", isLoading: false });
      toast.error("Không thể đăng bình luận");
    }
  },

  deleteComment: async (commentId: string, token: string) => {
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.delete(`/comments/${commentId}`);
      set((state) => ({
        comments: state.comments.filter((comment) => comment._id !== commentId),
        isLoading: false,
      }));
      toast.success("Đã xóa bình luận thành công");
    } catch (error: any) {
      set({ error: "Lỗi khi xóa bình luận", isLoading: false });
      toast.error("Không thể xóa bình luận");
    }
  },

  toggleLikeComment: async (commentId: string, token: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.post(`/comments/${commentId}/like`);
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment._id === commentId ? { ...comment, likes: response.data.likes } : comment
        ),
        isLoading: false,
      }));
      toast.success(response.data.message);
    } catch (error: any) {
      set({ error: "Lỗi khi thao tác với bình luận", isLoading: false });
      toast.error("Không thể thao tác với bình luận");
    }
  },
})); 