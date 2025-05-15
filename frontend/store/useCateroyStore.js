// store/categoryStore.js
import { create } from "zustand";
import { request } from "@/util/request";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  loadingCategories: false,
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),

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

  fetchCategoriesOwner: async () => {
    set({ loadingCategories: true, error: null });
    try {
      const res = await request("/categories", "GET");
      // Since the Laravel controller returns a raw array, not { data: [...] }
      set({ categories: res || [] });
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      set({
        error: err.response?.data?.message || err.message,
        categories: [],
      });
    } finally {
      set({ loadingCategories: false });
    }
  },

  addCategory: async (formData) => {
    try {
      // DO NOT manually set Content-Type for FormData
      await request("/admin/categories", "POST", formData);

      await get().fetchCategories(); // refresh category list
    } catch (err) {
      set({
        error: `Error adding category: ${
          err?.response?.data?.message || err.message || "Unknown error"
        }`,
      });
    }
  },
  editCategory: async (slug, formData) => {
    if (!slug || !formData) {
      console.error("Slug or formData is missing for editCategory");
      return;
    }

    try {
      formData.append("_method", "PUT"); // Or "PATCH" if your backend prefers it
      await request(`/admin/categories/${slug}`, "POST", formData); // Use POST with FormData
      set({ selectedCategory: null });
      await get().fetchCategories();
    } catch (err) {
      console.error("Error editing category:", err);
      set({ error: `Error editing category: ${err.message}` });
    }
  },

  deleteCategory: async (slug) => {
    try {
      await request(`/admin/categories/${slug}`, "DELETE");
      await get().fetchCategories();
    } catch (err) {
      set({ error: `Error deleting category: ${err.message}` });
    }
  },
}));
