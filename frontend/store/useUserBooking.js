import { create } from "zustand";
import { request } from "@/util/request"; // Import the request utility

export const useUserBooking = create((set) => ({
  bookings: [],
  loading: false,
  error: null,

  // Fetch bookings for the user
  fetchBookings: async () => {
    set({ loading: true, error: null });

    try {
      const response = await request("/users/bookings", "GET"); // Replace with your API endpoint
      set({ bookings: response.data }); // Assuming the response contains the bookings in `data`
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch bookings." });
    } finally {
      set({ loading: false });
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    try {
      await request(`/users/bookings/${bookingId}`, "DELETE"); // Replace with your cancel booking API endpoint
      set((state) => ({
        bookings: state.bookings.filter((booking) => booking.id !== bookingId),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to cancel booking." });
    }
  },
}));
