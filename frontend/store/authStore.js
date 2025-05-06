// store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { request } from "@/util/request";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const res = await request("/login", "POST", { email, password });

          set({
            user: res.user,
            token: res.token,
          });

          return res;
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

      getToken: () => {
        return get().token;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // or localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
