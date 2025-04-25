import { create } from "zustand";
import { request } from "@/util/request";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const res = await request("/login", "POST", { email, password });

      localStorage.setItem("token", res.token); // Save token
      set({
        user: res.user, // Adjust if your API returns differently
        token: res.token,
      });
      return res; // ✅ Return whole response
    } catch (err) {
      console.error("Login error:", err);
      set({
        error: err.response?.data?.message || "Login failed.",
      });
    } finally {
      set({ loading: false });
    }
  },


  logout: async () => {
    set({ loading: true, error: null });

    try {
      await request("/auth/logout", "POST");

      localStorage.removeItem("token");
      set({ user: null, token: null });
    } catch (err) {
      console.error("Logout error:", err);
      set({
        error: err.response?.data?.message || "Logout failed.",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
