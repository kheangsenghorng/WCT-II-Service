// store/userStore.js
import { create } from "zustand";
import { request } from "@/util/request";

export const useUserStore = create((set) => ({
  user: null,
  users: [],
  error: null,
  loading: false,

  fetchUserById: async (id) => {
    set({ loading: true, error: null });

    try {
      const user = await request(`/users/${id}`, "GET");
      set({ user });
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ error: err.response?.data?.message || "Failed to fetch user." });
    } finally {
      set({ loading: false });
    }
  },

  fetchUsersByOwner: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/owner/users/${ownerId}`, "GET");
      set({ users: res.users });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch users.",
      });
    } finally {
      set({ loading: false });
    }
  },

  clearUsers: () => set({ users: [] }),
}));
