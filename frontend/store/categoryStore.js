import { create } from "zustand";
import { request } from "@/util/request";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  selectedCategory: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await request("/categories", "GET");
      set({ categories: response });
    } catch (err) {
      set({ error: `Error fetching categories: ${err.message}` });
    } finally {
      set({ loading: false });
    }
  },
}));
