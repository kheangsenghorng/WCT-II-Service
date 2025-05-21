"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogStore } from "@/store/useBlogStore";
import Image from "next/image";

export default function BlogPage() {
  const { id } = useParams();
  const {
    blogs,
    fetchAllBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
    selectedBlog,
    selectBlog,
    clearSelectedBlog,
    loading,
  } = useBlogStore();

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
    previewUrls: [],
  });

  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
        images: [],
        previewUrls: Array.isArray(selectedBlog.images) ? selectedBlog.images : [selectedBlog.images],
      });
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }, [selectedBlog]);

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const openAddForm = () => {
    clearSelectedBlog();
    revokePreviewUrls();
    setFormData({
      title: "",
      content: "",
      images: [],
      previewUrls: [],
    });
    if (fileInputRef.current) fileInputRef.current.value = null;
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    selectBlog(blog);
    setShowForm(true);
  };

  const revokePreviewUrls = useCallback(() => {
    if (formData.previewUrls) {
      formData.previewUrls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [formData.previewUrls]);

  // const handleFormSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = new FormData();
  //   data.append("title", formData.title);
  //   data.append("content", formData.content);

  //   if (formData.images && formData.images.length > 0) {
  //     for (let i = 0; i < formData.images.length; i++) {
  //       data.append("images[]", formData.images[i]);
  //     }
  //   }

  //   try {
  //     if (selectedBlog) {
  //       await updateBlog(selectedBlog.id, data);
  //     } else {
  //       await addBlog(data);
  //     }
  //     setShowForm(false);
  //     clearSelectedBlog();
  //     revokePreviewUrls();
  //     if (fileInputRef.current) fileInputRef.current.value = null;
  //     fetchAllBlogs();
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert("Failed to save blog. Please check console for details.");
  //   }
  // };

  const openDeleteConfirm = (blog) => {
    selectBlog(blog);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedBlog) {
      await deleteBlog(selectedBlog.id);
      setShowConfirm(false);
      clearSelectedBlog();
      fetchAllBlogs();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
  
    if (formData.images.length > 0) {
      data.append("images", formData.images[0]); // ✅ Only one image
    }
  
    try {
      if (selectedBlog) {
        await updateBlog(selectedBlog.id, data);
      } else {
        await addBlog(data);
      }
  
      setShowForm(false);
      clearSelectedBlog();
      revokePreviewUrls();
      if (fileInputRef.current) fileInputRef.current.value = null;
      fetchAllBlogs();
    } catch (error) {
      console.error("Error submitting form:", error?.response?.data || error);
      alert("Failed to save blog. Please check console for details.");
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      revokePreviewUrls();
  
      const previewUrl = URL.createObjectURL(file);
  
      setFormData((prev) => ({
        ...prev,
        images: [file], // Keep as array of one for consistency
        previewUrls: [previewUrl],
      }));
    }
  };
  

  useEffect(() => {
    return () => {
      revokePreviewUrls();
    };
  }, [revokePreviewUrls]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Blog Management</h1>
        <button
          onClick={openAddForm}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Blog
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading blogs...</p>
      ) : (
        /* Blog Table */
        <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Content</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Image</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
  {blogs.map((blog, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200">
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{index + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200">{blog.title}</td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{blog.content}</td>
                <td className="px-6 py-4">
                  {blog.images && blog.images.length > 0 ? (
                    <Image
                      src={Array.isArray(blog.images) ? blog.images[0] : blog.images}
                      alt={blog.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover w-16 h-16 border border-gray-300 dark:border-gray-600"
                    />
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
                  )}
                </td>
                <td className="px-6 py-4 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => openEditForm(blog)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(blog)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {selectedBlog ? "Edit Blog" : "Add Blog"}
              </h2>
              <form
                onSubmit={handleFormSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image</label>
                  <input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  ref={fileInputRef}
  className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
/>

                </div>

                {/* Image Preview */}
                {formData.previewUrls && formData.previewUrls.length > 0 && (
                  <div className="flex space-x-2">
                    {formData.previewUrls.map((url, index) => (
                      <div key={index} className="relative w-20 h-20 rounded overflow-hidden">
                        <Image
                          src={url}
                          alt={`Preview ${index}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="object-top"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      clearSelectedBlog();
                      revokePreviewUrls();
                      setFormData({
                        title: "",
                        content: "",
                        images: [],
                        previewUrls: [],
                      });
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    {selectedBlog ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-xl w-full max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete this blog?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    clearSelectedBlog();
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}