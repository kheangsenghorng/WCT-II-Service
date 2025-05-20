import { create } from "zustand";
import { request } from "@/util/request";
import { useAuthStore } from "@/store/authStore"; // ⬅️ Add this line


export const useBlogStore = create((set) => ({
  blogs: [],
  loading: false,
  error: null,
  selectedBlog: null,

  fetchAllBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState()?.getToken?.();
      const res = await request("/admin/blogs", "GET", null, token);
      if (!Array.isArray(res)) throw new Error("Unexpected blog format");
      set({ blogs: res });
    } catch (err) {
      console.error("Blog error:", err);
      set({
        error: err?.response?.data?.message || err?.message || "Some blog error",
      });
    } finally {
      set({ loading: false });
    }
  },

  
  
  addBlog: async (formData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState()?.getToken?.();

      // No need to append admin_id here

      const res = await request("/admin/blogs", "POST", formData, token, true); // Make sure isFormData is `true` if sending FormData
      console.log(res);
      set((state) => ({
        blogs: [...state.blogs, res],
        loading: false, // Move loading to here so it doesn't keep loading
      }));
      // Set success state
    } catch (error) {
      console.error("Error adding blog:", error);
      set({
        error: error?.response?.data?.message || error?.message || "Failed to add blog",
        loading: false,
      });
    }
  },

  updateBlog: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState()?.getToken?.();
      const res = await request(`/admin/blogs/${id}`, "PUT", formData, token, true);
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id === id ? res : b)),
      }));
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Update blog failed",
      });
    } finally {
      set({ loading: false });
    }
  },
  

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState()?.getToken?.();
      await request(`/admin/blogs/${id}`, "DELETE", null, token);
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }));
    } catch (err) {
      set({
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Delete blog failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  selectBlog: (blog) => set({ selectedBlog: blog }),
  clearSelectedBlog: () => set({ selectedBlog: null }),
  clearBlogs: () => set({ blogs: [], error: null, selectedBlog: null }),
}));
