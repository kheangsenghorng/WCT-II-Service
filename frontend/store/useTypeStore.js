// store/useTypeStore.js
import { create } from "zustand";
import { request } from "@/util/request";
import { useAuthStore } from "@/store/authStore";  // Import useAuthStore

export const useTypeStore = create((set) => ({
  userTypes: [],
  loading: false,
  error: null,
  selectedUserType: null,

  fetchAllUserTypes: async () => {
    set({ loading: true, error: null });
    try {
      // Get the token inside the component's scope
      const token = useAuthStore.getState()?.getToken?.();
      const res = await request("/admin/type", "GET", null, token);  // Pass token

      if (!res) {
        throw new Error("Invalid response from server (fetchAllUserTypes)");
      }

      let types = Array.isArray(res) ? res : res?.data || [];  // Access res properly and simplify

      // Ensure each user type has a service_categories_id property
      types = types.map(type => ({
        ...type,
        service_categories_id: type.service_categories_id || [], // Ensure this exists and is an array
        // Optionally add other default values if needed
      }));

      set({ userTypes: types });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch user types.  Check server logs.",
      });
    } finally {
      set({ loading: false });
    }
  },

  addUserType: async (name, serviceCategoriesId) => {
    set({ loading: true, error: null });
    try {
        const token = useAuthStore.getState()?.getToken?.(); // Get Token
        const res = await request("/admin/type", "POST", {
          name,
          service_categories_id: Number(serviceCategoriesId),
        }, token); // pass token

      if (!res) {
        throw new Error("Invalid response from server (addUserType)");
      }

      set((state) => ({
        userTypes: [...state.userTypes, {
          ...res,
          service_categories_id: res.service_categories_id || [],
        }],
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || "Failed to add user type.",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateUserType: async (id, name, serviceCategoriesId) => {
    set({ loading: true, error: null });
    try {
        const token = useAuthStore.getState()?.getToken?.(); // Get Token
        const res = await request(`/admin/type/${id}`, "PUT", {
          name,
          service_categories_id: Number(serviceCategoriesId), // Ensure it's an array
        }, token);
        
        if (!res) {
          throw new Error("Invalid response from server (updateUserType)");
        }

        // Update user types in state
        set((state) => ({
          userTypes: state.userTypes.map((type) =>
            type.id === id
              ? {
                  ...res,  // Update the type with the response from the server
                  service_categories_id: res.service_categories_id || [],  // Ensure service_categories_id is always an array
                }
              : type
          ),
        }));
    } catch (err) {
        set({
          error: err.response?.data?.message || err.message || "Failed to update user type.",
        });
    } finally {
        set({ loading: false });
    }
},


  deleteUserType: async (id) => {
    set({ loading: true, error: null });
    try {
        const token = useAuthStore.getState()?.getToken?.(); // Get Token
      await request(`/admin/type/${id}`, "DELETE", null, token); // pass token
      set((state) => ({
        userTypes: state.userTypes.filter((type) => type.id !== id),
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || "Failed to delete user type.",
      });
    } finally {
      set({ loading: false });
    }
  },

  clearUserTypes: () => set({ userTypes: [], selectedUserType: null }),
}));