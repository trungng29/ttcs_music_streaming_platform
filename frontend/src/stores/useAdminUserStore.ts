import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";
import { toast } from "sonner";

interface AdminUserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: "user" | "artist" | "admin") => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useAdminUserStore = create<AdminUserStore>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/admin/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.message });
      toast.error("Failed to fetch users");
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserRole: async (userId: string, role: "user" | "artist" | "admin") => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, role } : user
        ),
      }));
      toast.success("User role updated successfully");
    } catch (error: any) {
      set({ error: error.message });
      toast.error("Failed to update user role");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      toast.success("User deleted successfully");
    } catch (error: any) {
      set({ error: error.message });
      toast.error("Failed to delete user");
    } finally {
      set({ isLoading: false });
    }
  },
})); 