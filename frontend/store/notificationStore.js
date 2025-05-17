import { create } from "zustand";
import { request } from "@/util/request";

export const useNotificationStore = create((set) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchMyNotifications: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/owner/notifications/my/${ownerId}`, "GET");
      set({ notifications: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch notifications",
        loading: false,
      });
    }
  },

  markAsRead: async (id) => {
    try {
      await request(`/notifications/${id}/mark-as-read`, "PATCH");
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
      }));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  deleteNotification: async (id) => {
    try {
      await request(`/notifications/${id}`, "DELETE");
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },
}));
