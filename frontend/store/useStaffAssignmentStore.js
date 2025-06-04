import { create } from "zustand";
import { request } from "@/util/request";

export const useStaffAssignmentStore = create((set, get) => ({
  staffByBooking: [],
  availableStaff: [],
  assignedStaff: [],
  loading: false,
  error: null,

  // Assign staff to bookings
  assignStaff: async (assignments = [], ownerId) => {
    try {
      set({ loading: true, error: null });
      const res = await request(
        `/owner/${ownerId}/booking-staff/assign`,
        "POST",
        assignments
      );

      // Refresh assigned staff for the booking
      if (assignments.length > 0) {
        const bookingId = assignments[0].booking_id;
        await get().fetchStaffByBooking(bookingId);
      }

      return res;
    } catch (error) {
      console.error("Assign staff failed:", error);
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Unassign a staff from a booking
  unassignStaff: async (bookingId, staffId) => {
    try {
      set({ loading: true, error: null });
      await request(
        `/owner/booking-staff/${bookingId}/staff/${staffId}`,
        "DELETE"
      );

      // Refresh assigned staff list
      await get().fetchStaffByBooking(bookingId);
    } catch (error) {
      console.error("Unassign staff failed:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get staff assigned to a specific booking (for owner)
  fetchStaffByBooking: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const res = await request(`/owner/booking-staff/${bookingId}`, "GET");
      set({ staffByBooking: res || [] });
    } catch (error) {
      console.error("Failed to fetch staff by booking:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get staff assigned to a booking (for user)
  fetchStaffByBookingUser: async (bookingId) => {
    try {
      set({ loading: true, error: null });
      const res = await request(`/user/booking-staff/${bookingId}`, "GET");
      set({ staffByBooking: res || [] });
    } catch (error) {
      console.error("Failed to fetch user staff by booking:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get available staff (not assigned to any active bookings)
  fetchAvailableStaff: async (ownerId) => {
    try {
      set({ loading: true, error: null });
      const res = await request(`/owner/${ownerId}/available-staff`, "GET");
      set({ availableStaff: res.data || [] });
    } catch (error) {
      console.error("Failed to fetch available staff:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get assigned staff for filtering (for owner's overview)
  fetchAssignedStaff: async (ownerId) => {
    try {
      set({ loading: true, error: null });
      const res = await request(`/owner/booking-staff/show/${ownerId}`, "GET");
      set({ assignedStaff: res.data || [] });
    } catch (error) {
      console.error("Failed to fetch assigned staff:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
}));
