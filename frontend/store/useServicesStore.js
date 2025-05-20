import { create } from "zustand";
import { request } from "@/util/request";

export const useServicesStore = create((set) => ({
  services: [],
  service: null,
  loading: false,
  error: null,
  creatingService: false,
  createError: null,
  createdService: null,
  service: null,
  setService: (data) => set({ service: data }),

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

  fetchAllServices: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/services`, "GET"); // <-- Make sure this API returns all services
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
      console.error("Full error response:", err.response);
      console.error("Error message:", err.message);

      let errorMessage = "Failed to add service."; // Default message

      if (err.response) {
        // Server responded with an error status
        errorMessage = `Failed to add service: Status ${err.response.status}`;

        if (err.response.data && err.response.data.message) {
          errorMessage += `, Message: ${err.response.data.message}`; // Append server's message
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = "Failed to add service: No response from server.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = `Failed to add service: ${err.message}`;
      }

      set({ createError: errorMessage, createdService: null }); // Update the state with the detailed message
      throw err;
    } finally {
      set({ creatingService: false });
    }
  },

  updateService: async (ownerId, serviceId, formData) => {
    set({ loading: true, error: null });
    try {
      formData.append("_method", "PUT"); // If your backend requires this override

      const updated = await request(
        `/owner/${ownerId}/services/${serviceId}`,
        "POST", // POST with _method=PUT hack
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

  deleteServiceImage: async (serviceId, imagePath) => {
    try {
      const response = await request(
        `/owner/services/${serviceId}/image`,
        "DELETE",
        {
          image_path: imagePath,
        }
      );

      // Update state after successful deletion (optional)
      set((state) => ({
        service: {
          ...state.service,
          images: response.images, // update images array
        },
      }));

      return response;
    } catch (error) {
      console.error("Failed to delete image:", error);
      throw error;
    }
  },

  fetchService: async (ownerId, serviceId) => {
    set({ loading: true, error: null });

    try {
      const data = await request(
        `/owner/${ownerId}/services/${serviceId}`,
        "GET"
      );
      
      set({ service: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch service",
        loading: false,
      });
    }
  },
}));
