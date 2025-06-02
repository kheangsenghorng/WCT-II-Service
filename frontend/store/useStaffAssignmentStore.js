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
      set({ loading: true });
      const res = await request(
        `/owner/${ownerId}/booking-staff/assign`,
        "POST",
        assignments
      );
      get().fetchStaffByBooking(assignments[0].booking_id); // optional refresh
      return res;
    } catch (error) {
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Unassign a staff from a booking
  unassignStaff: async (bookingId, staffId) => {
    try {
      set({ loading: true });
      await request(
        `/owner/booking-staff/${bookingId}/staff/${staffId}`,
        "DELETE"
      );
      get().fetchStaffByBooking(bookingId); // optional refresh
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get staff assigned to a booking
  fetchStaffByBooking: async (bookingId) => {
    try {
      set({ loading: true });
      const res = await request(`/owner/booking-staff/${bookingId}`, "GET");
      set({ staffByBooking: res });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get available staff (NOT assigned to incomplete bookings)
  fetchAvailableStaff: async (ownerId) => {
    try {
      set({ loading: true });
      const res = await request(`/owner/${ownerId}/available-staff`, "GET");
      set({ availableStaff: res.data || [] });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Get currently assigned (incomplete) staff for filtering
  fetchAssignedStaff: async (ownerId) => {
    try {
      set({ loading: true });
      const res = await request(`/owner/booking-staff/show/${ownerId}`, "GET");
      set({ assignedStaff: res.data || [] });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
  // Get staff assigned to a booking
  fetchStaffByBookingUser: async (bookingId) => {
    try {
      set({ loading: true });
      const res = await request(`/user/booking-staff/${bookingId}`, "GET");
      set({ staffByBooking: res });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },
}));
