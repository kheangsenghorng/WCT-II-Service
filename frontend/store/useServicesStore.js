import { create } from "zustand";
import { request } from "@/util/request";

export const useServicesStore = create((set) => ({
  services: [],
  categories: [],
  serviceTypes: [],
  loadingServices: false,
  loadingCategories: false,
  loadingServiceTypes: false,
  error: null,

  fetchServices: async (ownerId) => {
    set({ loadingServices: true, error: null });
    try {
      // Use the dynamic owner ID directly in the URL path
      const response = await request(`/owner/${ownerId}/services`, "GET");
      set({ services: response.data || [] });
    } catch (err) {
      console.error('Error fetching services:', err);
      set({ error: err.response?.data?.message || err.message });
      set({ services: [] });
    } finally {
      set({ loadingServices: false });
    }
  },
  
  

  fetchCategories: async () => {
    set({ loadingCategories: true });
    try {
      // Changed to non-admin route since owners need access
      const res = await request("/categories", "GET");
      set({ categories: res.data || [] });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      set({ error: err.response?.data?.message || err.message });
      set({ categories: [] });
    } finally {
      set({ loadingCategories: false });
    }
  },
  
  fetchServiceTypes: async () => {
    set({ loadingServiceTypes: true });
    try {
      // This still needs admin access - consider creating a public endpoint
      const response = await request("/admin/type", "GET");
      set({ serviceTypes: response.data?.types || [] });
    } catch (err) {
      console.error("Failed to fetch service types:", err);
      set({ error: err.response?.data?.message || err.message });
      set({ serviceTypes: [] });
    } finally {
      set({ loadingServiceTypes: false });
    }
  },

  addService: async (ownerId, formData) => {
    try {
      const response = await request(
        `/owner/${ownerId}/services`, 
        "POST", 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      set((state) => ({
        services: [...state.services, response.data],
      }));
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  
  updateService: async (ownerId, serviceId, data) => {
    try {
      const response = await request(
        `/owner/${ownerId}/services/${serviceId}`, 
        "PUT", 
        data
      );
      set((state) => ({
        services: state.services.map((s) =>
          s.id === serviceId ? response.data : s
        ),
      }));
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
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