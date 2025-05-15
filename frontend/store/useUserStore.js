// store/userStore.js
import { create } from "zustand";
import { request } from "@/util/request";

export const useUserStore = create((set) => ({
  user: null,
  users: [],
  staff: null,
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
  updateUserOwner: async (ownerId, userId, formData) => {
    set({ loading: true, error: null });

    try {
      formData.append("_method", "PUT");
      // Laravel expects PUT, but when sending FormData, use POST with _method=PUT spoofing
      const data = await request(
        `/owner/${ownerId}/user/${userId}`,
        "POST",
        formData
      );

      // Update user in local state
      const updatedUser = data.user;
      const users = get().users.map((u) => (u.id === userId ? updatedUser : u));
      set({ users, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
  deleteUser: async (ownerId, userId) => {
    set({ loading: true, error: null });
    try {
      await request(`/owner/${ownerId}/user/${userId}`, "DELETE");
      const users = get().users.filter((u) => u.id !== userId);
      set({ users, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
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

  fetchAdminUsers: async () => {
    set({ loading: true, error: null });

    try {
      const res = await request("/admin/users", "GET");
      set({
        users: res, // assuming res is an array of users
        count: res.length, // total number of users
      });
    } catch (err) {
      console.error("Error fetching admin users:", err);
      set({
        error: err.response?.data?.message || "Failed to fetch admin users.",
      });
    } finally {
      set({ loading: false });
    }
  },
  // Fetch a specific staff by owner and user ID
  fetchSingleStaff: async (ownerId, userId) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/owner/${ownerId}/users/${userId}`, "GET");
      set({ staff: res.user, loading: false }); // ✅ make sure it's `res.data.user`
    } catch (error) {
      set({
        error:
          error?.response?.data?.message || "Failed to fetch staff member.",
        loading: false,
      });
    }
  },

  clearStaff: () => set({ staff: [], singleStaff: null, error: null }),

  clearUsers: () => set({ users: [] }),
}));
