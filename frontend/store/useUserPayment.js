import { create } from "zustand";
import { request } from "@/util/request";

export const useUserPayment = create((set) => ({
  payments: [],
  loading: false,
  error: null,

  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request("/users/payments", "GET");
      set({ payments: data });
    } catch (err) {
      set({ error: `Error fetching payments: ${err.message}` });
    } finally {
      set({ loading: false });
    }
  },

  makePayment: async (paymentData) => {
    try {
      await request("/users/payments", "POST", paymentData);
      set({ error: null });
      await get().fetchPayments(); // refresh list after new payment
    } catch (err) {
      set({ error: `Error making payment: ${err.message}` });
    }
  },
}));
