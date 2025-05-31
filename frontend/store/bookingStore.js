import { create } from "zustand";
import { persist } from "zustand/middleware";
import { request } from "@/util/request";

// ✅ Utility function for checking "Unauthenticated." and clearing localStorage
const handleApiError = (error) => {
  const message = error?.response?.data?.message;
  if (message === "Unauthenticated.") {
    localStorage.removeItem("booking-storage");
  }
  return message || error.message || "Something went wrong";
};

export const useBookingStoreFetch = create(
  persist(
    (set) => ({
      bookings: [],
      loading: false,
      booking: null,
      error: null,
      bookedSlots: [],
      loadingSlots: false,
      service: null,
      stats: null,
      userBookings: [],

      // Fetch all bookings by userId & serviceId
      fetchBookingsByUserAndService: async (userId, serviceId) => {
        set({ loading: true, error: null });
        try {
          const data = await request(
            `/owner/user/${userId}/service/${serviceId}`,
            "GET"
          );
          set({ bookings: data.bookings, loading: false });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loading: false });
        }
      },

      // Fetch a single booking by ID
      fetchBookingById: async (id) => {
        set({ loading: true, error: null });
        try {
          const data = await request(`/owner/booking/${id}`, "GET");
          set({ booking: data.booking, loading: false });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loading: false });
        }
      },

      // Fetch all bookings by ownerId
      fetchBookingsByOwner: async (ownerId) => {
        set({ loading: true, error: null });
        try {
          const data = await request(`/owner/by-owner/${ownerId}`, "GET");
          set({ bookings: data, loading: false });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loading: false });
        }
      },

      fetchBookedSlots: async (serviceId, date) => {
        set({ loadingSlots: true, error: null });
        try {
          const data = await request(
            `/bookings/booked-times/${serviceId}`,
            "GET",
            {},
            { params: { date } }
          );
          set({ bookedSlots: data, loadingSlots: false });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loadingSlots: false });
        }
      },

      fetchServiceBookings: async (ownerId, serviceId) => {
        set({ loading: true, error: null });
        try {
          const response = await request(
            `/owner/bookings/by-owner/${ownerId}/service/${serviceId}`,
            "GET"
          );
          set({
            service: response.service,
            stats: response.related_bookings_stats,
            userBookings: response.user_bookings,
            loading: false,
          });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loading: false });
        }
      },

      // Fetch all bookings for a user
      fetchBookingsByUserId: async (userId) => {
        set({ loading: true, error: null });
        try {
          const data = await request(`/bookings/user/${userId}`, "GET");
          set({ bookings: data.bookings, loading: false });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loading: false });
        }
      },

      fetchBookingDetail: async (userId, serviceId, bookingId) => {
        set({ loading: true, error: null });
        try {
          const response = await request(
            `/bookings/user/${userId}/service/${serviceId}/booking/${bookingId}`,
            "GET"
          );
          set({
            booking: response.booking,
            loading: false,
          });
        } catch (error) {
          const errorMsg = handleApiError(error, set);
          set({ error: errorMsg, loading: false });
        }
      },

      // Clear all bookings and errors
      clearBookings: () =>
        set({
          bookings: [],
          error: null,
          service: null,
          stats: null,
          userBookings: [],
          loading: false,
        }),
    }),
    {
      name: "booking-storage", // key in localStorage
    }
  )
);
