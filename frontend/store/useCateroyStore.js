// store/categoryStore.js
import { create } from "zustand";
import { request } from "@/util/request";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

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
    const { fetchCategories } = get();
    if (!slug || !formData) return;

    try {
      await request(
        `/admin/categories/${slug}`,
        "POST", // Use "POST" with `_method=PUT` if Laravel expects it
        formData
      );

      set({ selectedCategory: null });
      await fetchCategories();
    } catch (err) {
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
