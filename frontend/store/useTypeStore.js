// store/useTypeStore.js
import { create } from "zustand";
import { request } from "@/util/request";
import { useAuthStore } from "@/store/authStore"; // Import useAuthStore

export const useTypeStore = create((set) => ({
  userTypes: [],
  types: [],
  loading: false,
  loadingTypes: false,
  error: null,
  selectedUserType: null,

  fetchAllUserTypes: async () => {
    set({ loading: true, error: null });
    try {
      // Get the token inside the component's scope
      const token = useAuthStore.getState()?.getToken?.();
      const res = await request("/admin/type", "GET", null, token); // Pass token

      if (!res) {
        throw new Error("Invalid response from server (fetchAllUserTypes)");
      }

      let types = Array.isArray(res) ? res : res?.data || []; // Access res properly and simplify

      // Ensure each user type has a service_categories_id property
      types = types.map((type) => ({
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
  fetchTypes: async () => {
    set({ loadingTypes: true, error: null });
    try {
      const res = await request("/type", "GET");
      // Laravel returns a raw array
      set({ types: res || [] });
    } catch (err) {
      console.error("Failed to fetch types:", err);
      set({
        error: err.response?.data?.message || err.message,
        types: [],
      });
    } finally {
      set({ loadingTypes: false });
    }
  },

  // addUserType: async (name, serviceCategoriesId) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const token = useAuthStore.getState()?.getToken?.(); // Get Token
  //     const res = await request(
  //       "/admin/type",
  //       "POST",
  //       {
  //         name,
  //         service_categories_id: Number(serviceCategoriesId),
  //       },
  //       token
  //     ); // pass token

  //     if (!res) {
  //       throw new Error("Invalid response from server (addUserType)");
  //     }

  //     set((state) => ({
  //       userTypes: [
  //         ...state.userTypes,
  //         {
  //           ...res,
  //           service_categories_id: res.service_categories_id || [],
  //         },
  //       ],
  //     }));
  //   } catch (err) {
  //     set({
  //       error:
  //         err.response?.data?.message ||
  //         err.message ||
  //         "Failed to add user type.",
  //     });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  addUserType: async (name, serviceCategoriesId, imageFile) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("service_categories_id", Number(serviceCategoriesId));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await request("/admin/type", "POST", formData);

      if (!res) {
        throw new Error("Invalid response from server (addUserType)");
      }

      set((state) => ({
        userTypes: [
          ...state.userTypes,
          {
            ...res.data, // the created Type is in res.data (adjust if different)
            service_categories_id: res.data.service_categories_id || [],
          },
        ],
      }));
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to add user type.",
      });
    } finally {
      set({ loading: false });
    }
  },

  updateUserType: async (id, name, serviceCategoriesId, imageFile) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); // 👈 Laravel-compatible method spoofing
      formData.append("name", name);
      formData.append("service_categories_id", serviceCategoriesId); // can be string or number

      if (imageFile) {
        formData.append("image", imageFile); // 👈 optional image
      }

      const res = await request(`/admin/type/${id}`, "POST", formData);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user type.");
      }

      const json = await res.json();

      if (!json?.data) {
        throw new Error("Invalid response from server (updateUserType)");
      }

      const updatedType = json.data;

      set((state) => ({
        userTypes: state.userTypes.map((type) =>
          type.id === id
            ? {
                ...updatedType,
                service_categories_id: updatedType.service_categories_id || [],
              }
            : type
        ),
      }));
    } catch (err) {
      set({
        error: err.message || "Failed to update user type.",
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
        error:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete user type.",
      });
    } finally {
      set({ loading: false });
    }
  },
  fetchTypesByCategory: async (categoryId) => {
    set({ loading: true, error: null });

    try {
      const data = await request(
        `/service-types?categoryId=${categoryId}`,
        "GET"
      );
      set({ types: data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch types",
        loading: false,
      });
    }
  },
  // clearTypes: () => set({ types: [], error: null }),

  clearUserTypes: () => set({ userTypes: [], selectedUserType: null }),
}));
