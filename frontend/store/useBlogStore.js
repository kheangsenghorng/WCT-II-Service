// store/blogStore.js
import { create } from "zustand";
import { request } from "@/util/request";

export const useBlogStore = create((set) => ({
  blogs: [],
  selectedBlog: null,
  loading: false,

  // Select & clear blog
  setSelectedBlog: (blog) => set({ selectedBlog: blog }),
  clearSelectedBlog: () => set({ selectedBlog: null }),

  // Fetch all blogs
  fetchBlogs: async () => {
    set({ loading: true });
    try {
      const blogs = await request("/admin/blogs", "GET");
      set({ blogs });
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Fetch single blog
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

  // Create new blog
  createBlog: async (formData, adminId) => {
    try {
      return await request(`/admin/blogs/${adminId}`, "POST", formData);
    } catch (error) {
      console.error("Failed to create blog:", error);
      throw error;
    }
  },

  // Update existing blog
  updateBlog: async (id, formData) => {
    try {
      formData.append("_method", "PUT"); // Laravel method spoofing
      return await request(`/admin/blogs/edit/${id}`, "POST", formData);
    } catch (error) {
      console.error("Failed to update blog:", error);
      throw error;
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    try {
      await request(`/api/blogs/${id}`, "DELETE");
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  },
}));
