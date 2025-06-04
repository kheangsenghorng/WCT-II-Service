import { create } from "zustand";
import { request } from "@/util/request"; // Import the request utility

export const useCompanyInfoStore = create((set) => ({
  companyInfo: null,
  loading: false,
  error: null,

  fetchCompanyInfo: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/owner/company-info/${id}`, "GET");
      set({ companyInfo: data.company }); // ✅ this now works correctly
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch company info",
      });
    } finally {
      set({ loading: false });
    }
  },

  saveCompanyInfo: async (userId, formData) => {
    set({ loading: true, error: null });
    try {
      const res = await request(
        `/owner/company-info/${userId}`, // must match the Laravel route
        "POST",
        formData
      );
      console.log("Company info saved successfully:", res.data); // Log the response for debugging

      set({ companyInfo: res.data.data }); // access res.data.data, not just res.data
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to save company info",
      });
    } finally {
      set({ loading: false });
    }
  },

  //   updateCompanyInfo: async (userId, formData) => {
  //     set({ loading: true, error: null });
  //     try {
  //       const res = await request(
  //         `/owner/company-info/${userId}`,
  //         "PUT",
  //         formData
  //       );
  //       set({ companyInfo: res.data });
  //     } catch (err) {
  //       set({
  //         error: err?.response?.data?.message || "Failed to update company info",
  //       });
  //     } finally {
  //       set({ loading: false });
  //     }
  //   },

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
