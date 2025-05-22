import { create } from "zustand";
import { persist } from "zustand/middleware";
import { request } from "@/util/request";

export const useBookingStoreFetch = create(
  persist(
    (set) => ({
      bookings: [],
      loading: false,
      booking: null, // ⬅️ single booking
      error: null,

      // ✅ Fetch all bookings by userId & serviceId
      fetchBookingsByUserAndService: async (userId, serviceId) => {
        set({ loading: true, error: null });
        try {
          const data = await request(
            `/owner/user/${userId}/service/${serviceId}`,
            "GET"
          );
          set({ bookings: data.bookings, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },
      // ✅ Fetch a single booking by ID
      fetchBookingById: async (id) => {
        set({ loading: true, error: null });
        try {
          const data = await request(`/owner/booking/${id}`, "GET");
          set({ booking: data.booking, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // ✅ Clear all bookings and errors
      clearBookings: () => set({ bookings: [], error: null }),
    }),
    {
      name: "booking-storage", // key in localStorage
    }
  )
);
