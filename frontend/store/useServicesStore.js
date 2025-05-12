import { create } from "zustand";
import { request } from "@/util/request"; // Assuming this utility is already created

export const useServicesStore = create((set) => ({
  services: [],
  loading: false,
  error: null,
  categories: [],

  // ✅ Fetch services for owner
  fetchServices: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const response = await request(`/owner/${ownerId}/services`, "GET");
      set({ services: response, loading: false });
    } catch {
      set({ error: "Failed to fetch services", loading: false });
    }
  },

  // ✅ Fetch a single service
  fetchService: async (ownerId, serviceId) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/owner/${ownerId}/services/${serviceId}`,
        "GET"
      );
      return response;
    } catch {
      set({ error: "Failed to fetch service", loading: false });
    }
  },

  // ✅ Add a new service
  addService: async (ownerId, serviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/owner/${ownerId}/services`,
        "POST",
        serviceData
      );
      set((state) => ({
        services: [...state.services, response],
        loading: false,
      }));
    } catch {
      set({ error: "Failed to add service", loading: false });
    }
  },

  // ✅ Update a service
  updateService: async (ownerId, serviceId, serviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/owner/${ownerId}/services/${serviceId}`,
        "PUT",
        serviceData
      );
      set((state) => ({
        services: state.services.map((service) =>
          service.id === serviceId ? response : service
        ),
        loading: false,
      }));
    } catch {
      set({ error: "Failed to update service", loading: false });
    }
  },

  // ✅ Delete a service
  deleteService: async (ownerId, serviceId) => {
    set({ loading: true, error: null });
    try {
      await request(`/owner/${ownerId}/services/${serviceId}`, "DELETE");
      set((state) => ({
        services: state.services.filter((s) => s.id !== serviceId),
        loading: false,
      }));
    } catch {
      set({ error: "Failed to delete service", loading: false });
    }
  },

  // ✅ Fetch categories (Admin route)
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await request("/admin/categories", "GET");
      set({ categories: response });
    } catch (err) {
      set({ error: `Error fetching categories: ${err.message}` });
    } finally {
      set({ loading: false });
    }
  },
}));
