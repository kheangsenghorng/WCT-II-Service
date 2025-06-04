import { create } from "zustand";
import { request } from "@/util/request"; // Import the request utility

export const useCompanyInfoStore = create((set) => ({
  companyInfo: null,
  loading: false,
  error: null,

  fetchCompanyInfo: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/owner/company-info/show`, "GET");
      set({ companyInfo: data });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch company info",
      });
    } finally {
      set({ loading: false });
    }
  },

  saveCompanyInfo: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/owner/company-info/${userId}`, "POST", data);
      set({ companyInfo: res.data });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to save company info",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateCompanyInfo: async (userId, data) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/owner/company-info/${userId}`, "PUT", data);
      set({ companyInfo: res.data });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to update company info",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteCompanyInfo: async (userId) => {
    set({ loading: true, error: null });
    try {
      await request(`/owner/users/${userId}/company-info`, "DELETE");
      set({ companyInfo: null });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to delete company info",
      });
    } finally {
      set({ loading: false });
    }
  },
}));
