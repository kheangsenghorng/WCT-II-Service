import { create } from "zustand";
import { request } from "@/util/request"; // Import the request utility

export const useUserBooking = create((set) => ({
  bookings: [],
  stats: {
    total_booking_count: 0,
    unique_services_count: 0,
    total_base_price: 0,
  },
  loading: false,
  error: null,
  totalBookings: 0, // <-- add this

  // Fetch all bookings
  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await request("/bookings", "GET");
      set({ bookings: response.data });
      set({ totalBookings: response.data.length }); // set total bookings from data length
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch total bookings.",
      });
    } finally {
      set({ loading: false });
    }
  },


  fetchBookingsByUserId: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await request(`/bookings?userId=${userId}`, "GET");
      set({
        bookings: response.data,
        totalBookings: response.data.length,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch user bookings.",
      });
    } finally {
      set({ loading: false });
    }
  },
  

  fetchTotalBookings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await request("/bookings", "GET");
      set({ totalBookings: response.data.length });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch total bookings.",
      });
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
      set({
        error: err.response?.data?.message || "Failed to cancel booking.",
      });
    }
  },

  fetchBookings: async () => {
    set({ loading: true, error: null });

    try {
      const data = await request("/bookings", "GET"); // Uses your helper with token + base_url
      set({ bookings: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch bookings", loading: false });
    }
  },

  fetchBookingsByOwnerId: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/owner/bookings/by-owner/${ownerId}`,
        "GET"
      );
      set({
        bookings: response.bookings,
        stats: response.related_bookings_stats,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message || "Failed to fetch bookings", loading: false });
    }
  },

  createBooking: async (servicesId, bookingData) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/bookings/services/${servicesId}`,
        "POST",
        bookingData
      );
      set((state) => ({
        bookings: [response.data, ...state.bookings],
        totalBookings: state.totalBookings + 1,
      }));
      return response.data; // optional: return the new booking for UI
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create booking.",
      });
      throw err; // optional: re-throw for UI error handling
    } finally {
      set({ loading: false });
    }
  },

  updateBooking: async (bookingId, newStatus) => {
    try {
      const updatedBooking = await request(
        `/bookings/${bookingId}`,
        "PUT",
        newStatus
      );
      return updatedBooking;
    } catch (error) {
      // Handle validation errors or auth issues
      console.error("Failed to update booking:", error);
      throw error;
    }
  },
}));
