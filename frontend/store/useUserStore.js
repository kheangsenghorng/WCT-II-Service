// store/userStore.js
import { create } from "zustand";
import { request } from "@/util/request";


export const useUserStore = create((set) => ({
  user: null,
  users: [],
  error: null,
  count: 0,
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
      set({
        users: res.users,
        count: res.count,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch users.",
      });
    } finally {
      set({ loading: false });
    }
  },
  createUserUnderOwner: async (formData, ownerId) => {
    set({ loading: true, error: null, successMessage: null });

    try {
      // Request to create user under owner
      const response = await request(`/owner/${ownerId}`, "POST", formData);
      // Handle success response
      set({
        successMessage: response?.message || "User created successfully",
        loading: false,
      });
    } catch (error) {
      // Extract error message from response
      const message =
        error?.response?.data?.message || "An unexpected error occurred.";
      set({ error: message, loading: false });
    }
  },

  updateUser: async (id, formData) => {
    formData.append("_method", "PUT"); // Laravel needs this for method spoofing on POST

    try {
      const updatedUser = await request(`/users/${id}`, "POST", formData);

      set({ user: updatedUser }); // Update Zustand store
      return updatedUser;
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    }
  },
  clearUsers: () => set({ users: [] }),
}));
