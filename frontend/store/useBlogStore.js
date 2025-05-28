import { create } from "zustand";
import { request } from "@/util/request"; // your centralized request helper

export const useBlogStore = create((set) => ({
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,

  setSelectedBlog: (blog) => set({ selectedBlog: blog }),
  clearSelectedBlog: () => set({ selectedBlog: null }),

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const blogs = await request("/admin/blogs", "GET");
      set({ blogs });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      set({ error: "Failed to fetch blogs. Please try again later." });
    } finally {
      set({ loading: false });
    }
  },

  fetchBlogById: async (id) => {
    if (!id) {
      console.error("No blog ID provided.");
      return null;
    }
    try {
      const blog = await request(`/admin/blogs/${id}`, "GET");
      set({ selectedBlog: blog });
      return blog;
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      return null;
    }
  },

  createBlog: async (formData, adminId) => {
    try {
      return await request(`/admin/blogs/${adminId}`, "POST", formData);
    } catch (error) {
      console.error("Failed to create blog:", error);
      throw error;
    }
  },

  updateBlog: async (id, formData) => {
    try {
      formData.append("_method", "PUT"); // Laravel method spoofing
      return await request(`/admin/blogs/edit/${id}`, "POST", formData);
    } catch (error) {
      console.error("Failed to update blog:", error);
      throw error;
    }
  },

  deleteBlog: async (blogId) => {
    try {
      await request(`/admin/blogs/${blogId}`, "DELETE"); // Use request helper with DELETE method
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== blogId),
        selectedBlog: null,
      }));
      return true;
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error;
    }
  },
}));