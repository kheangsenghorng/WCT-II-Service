import { create } from "zustand";
import { request } from "@/util/request";
import { useAuthStore } from "@/store/authStore";

export const useBlogStore = create((set) => ({
  blogs: [],
  loading: false,
  error: null,
  selectedBlog: null,
  formData: {
    title: "",
    content: "",
    image: null,
    previewUrl: null,
  },
  formError: null,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setFormError: (error) => set({ formError: error }),

  revokePreviewUrl: () =>
    set((state) => {
      if (state.formData.previewUrl) {
        URL.revokeObjectURL(state.formData.previewUrl);
      }
      return {
        formData: { ...state.formData, previewUrl: null },
      };
    }),

  clearSelectedBlog: () =>
    set({
      selectedBlog: null,
      formData: {
        title: "",
        content: "",
        image: null,
        previewUrl: null,
      },
    }),

  selectBlog: (blog) =>
    set({
      selectedBlog: blog,
      formData: {
        title: blog.title || "",
        content: blog.content || "",
        image: null,
        previewUrl: blog.image || null,
      },
    }),

  handleImageChange: (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      set((state) => ({
        formData: {
          ...state.formData,
          image: file,
          previewUrl,
        },
      }));
    }
  },

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
        error:
          err?.response?.data?.message || err?.message || "Failed to fetch blogs",
      });
    } finally {
      set({ loading: false });
    }
  },

  addBlog: async (formData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState()?.getToken?.();
      const res = await request("/admin/blogs", "POST", formData, token, true);
      set((state) => ({
        blogs: [...state.blogs, res],
        loading: false,
      }));
    } catch (error) {
      console.error("Error adding blog:", error);
      set({
        error:
          error?.response?.data?.message || error?.message || "Failed to add blog",
        loading: false,
      });
    }
  },

  updateBlog: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const token = useAuthStore.getState()?.getToken?.();
      const updated = await request(
        `/admin/blogs/${id}`,
        "PUT",
        formData,
        token,
        true
      );
      set((state) => ({
        blogs: state.blogs.map((blog) =>
          blog.id === id ? updated : blog
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Error updating blog:", error);
      set({
        error:
          error?.response?.data?.message || error?.message || "Failed to update blog",
        loading: false,
      });
    }
  },

  
  
  // addBlog: async (formData) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const token = useAuthStore.getState()?.getToken?.();

  //     // No need to append admin_id here

  //     const res = await request("/admin/blogs", "POST", formData, token, true); // Make sure isFormData is `true` if sending FormData
  //     console.log(res);
  //     set((state) => ({
  //       blogs: [...state.blogs, res],
  //       loading: false, // Move loading to here so it doesn't keep loading
  //     }));
  //     // Set success state
  //   } catch (error) {
  //     console.error("Error adding blog:", error);
  //     set({
  //       error: error?.response?.data?.message || error?.message || "Failed to add blog",
  //       loading: false,
  //     });
  //   }
  // },

  // updateBlog: async (id, formData) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const token = useAuthStore.getState()?.getToken?.();
  //     const response = await request(
  //       `/admin/blogs/${id}`,
  //       "PUT",
  //       formData,
  //       token,
  //       true // Assumes multipart/form-data
  //     );
  
  //     set((state) => ({
  //       blogs: state.blogs.map((blog) =>
  //         blog.id === id ? response : blog
  //       ),
  //     }));
  //   } catch (err) {
  //     console.error("Blog update failed:", err);
  //     set({
  //       error:
  //         err?.response?.data?.message ||
  //         err?.message ||
  //         "Update blog failed",
  //     });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
  

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
