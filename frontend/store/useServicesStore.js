import { create } from "zustand";
import { request } from "@/utils/request"; // Assuming this utility is already created

// Zustand store for managing services
export const useServicesStore = create((set) => ({
  services: [],
  loading: false,
  error: null,

  // Fetch services with optional filters
  fetchServices: async (ownerId, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const { category, type } = filters;
      const response = await request(`/services/${ownerId}`, "GET", {
        category,
        type,
      });
      set({ services: response, loading: false });
    } catch {
      set({ error: "Failed to fetch services", loading: false });
    }
  },

  // Fetch a single service
  fetchService: async (ownerId, serviceId) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/services/${ownerId}/${serviceId}`,
        "GET"
      );
      return response;
    } catch {
      set({ error: "Failed to fetch service", loading: false });
    }
  },

  // Add a new service
  addService: async (ownerId, serviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/services/${ownerId}`,
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

  // Update an existing service
  updateService: async (ownerId, serviceId, serviceData) => {
    set({ loading: true, error: null });
    try {
      const response = await request(
        `/services/${ownerId}/${serviceId}`,
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

  // Delete a service
  deleteService: async (ownerId, serviceId) => {
    set({ loading: true, error: null });
    try {
      await request(`/services/${ownerId}/${serviceId}`, "DELETE");
      set((state) => ({
        services: state.services.filter((service) => service.id !== serviceId),
        loading: false,
      }));
    } catch {
      set({ error: "Failed to delete service", loading: false });
    }
  },
}));
