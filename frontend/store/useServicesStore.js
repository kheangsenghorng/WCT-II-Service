import { create } from "zustand";
import { request } from "@/util/request";

export const useServicesStore = create((set) => ({
  services: [],
  loading: false,
  error: null,
  creatingService: false,
  createError: null,
  createdService: null,

  fetchServicesByOwner: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/owner/${ownerId}/services`, "GET");
      set({ services: data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to load services",
        loading: false,
      });
    }
  },

  // fetchCategories: async () => {
  //   set({ loadingCategories: true });
  //   try {
  //     // Changed to non-admin route since owners need access
  //     const res = await request("/categories", "GET");
  //     set({ categories: res.data || [] });
  //   } catch (err) {
  //     console.error("Failed to fetch categories:", err);
  //     set({ error: err.response?.data?.message || err.message });
  //     set({ categories: [] });
  //   } finally {
  //     set({ loadingCategories: false });
  //   }
  // },

  // fetchServiceTypes: async () => {
  //   set({ loadingServiceTypes: true });
  //   try {
  //     // This still needs admin access - consider creating a public endpoint
  //     const response = await request("/admin/type", "GET");
  //     set({ serviceTypes: response.data?.types || [] });
  //   } catch (err) {
  //     console.error("Failed to fetch service types:", err);
  //     set({ error: err.response?.data?.message || err.message });
  //     set({ serviceTypes: [] });
  //   } finally {
  //     set({ loadingServiceTypes: false });
  //   }
  // },
  createService: async (ownerId, formData) => {
    set({ creatingService: true, createError: null });

    try {
      const res = await request(`/owner/${ownerId}/services`, "POST", formData);

      set({ createdService: res });
      return res;
    } catch (err) {
      console.error("Failed to create service:", err);
      set({
        createError: err.response?.data?.message || err.message,
        createdService: null,
      });
      throw err;
    } finally {
      set({ creatingService: false });
    }
  },

  updateService: async ({ ownerId, serviceId, formData }) => {
    set({ loading: true, error: null });

    try {
      formData.append("_method", "PUT"); // Laravel expects this for method spoofing
      const updated = await request(
        `/owner/${ownerId}/services/${serviceId}`,
        "POST",
        formData
      );
      set({ service: updated, loading: false });
      return updated;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Update failed",
        loading: false,
      });
      throw error;
    }
  },

  deleteService: async (ownerId, serviceId) => {
    try {
      await request(`/owner/${ownerId}/services/${serviceId}`, "DELETE");
      set((state) => ({
        services: state.services.filter((s) => s.id !== serviceId),
      }));
    } catch (err) {
      throw err.response?.data || err;
    }
  },
}));
