"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [], // Store multiple files
    previewUrls: [], // Array to store multiple preview URLs
  });

  // Sync formData when selectedBlog changes
  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
        images: [], // Reset to empty array
        previewUrls: Array.isArray(selectedBlog.images) ? selectedBlog.images : [selectedBlog.images], // Assign existing image URLs
      });
    }
  }, [selectedBlog]);

  // Fetch blogs on mount
  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const openAddForm = () => {
    clearSelectedBlog();
    revokePreviewUrls(); // Clean up before opening form
    setFormData({
      title: "",
      content: "",
      images: [],
      previewUrls: [],
    });
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    selectBlog(blog);
    setShowForm(true);
  };

  const revokePreviewUrls = useCallback(() => {
    if (formData.previewUrls) {
      formData.previewUrls.forEach(url => URL.revokeObjectURL(url));
    }
  }, [formData.previewUrls]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);

    // append images to form data
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        data.append("images[]", formData.images[i]); // ✅ append multiple images as array
      }
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
      fetchAllBlogs(); // Refetch the list to get updated blogs
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save blog. Please check console for details.");
    }
  };

  const openDeleteConfirm = (blog) => {
    selectBlog(blog);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (selectedBlog) {
      await deleteBlog(selectedBlog.id);
      setShowConfirm(false);
      clearSelectedBlog();
      fetchAllBlogs(); // Refetch the list to get updated blogs
    }
  };

  // Handle image changes
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);

      // revoke old previews first if any
      if (formData.previewUrls) {
        formData.previewUrls.forEach(url => URL.revokeObjectURL(url));
      }

      // create and store new preview urls
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));

      setFormData(prev => ({
        ...prev,
        images: newImages,
        previewUrls: newPreviewUrls,
      }));
    }
  };

  // Clean up preview URLs when image or component unmounts
  useEffect(() => {
    return () => {
      revokePreviewUrls();
    };
  }, [revokePreviewUrls]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <button
          onClick={openAddForm}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="mr-2" />
          Add Blog
        </button>
      </div>

      {loading ? (
        <p>Loading blogs...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border-b text-left">ID</th>
                <th className="px-4 py-2 border-b text-left">Title</th>
                <th className="px-4 py-2 border-b text-left">Content</th>
                <th className="px-4 py-2 border-b text-left">Image</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{blog.title}</td>
                  <td className="px-4 py-2 border-b">{blog.content}</td>
                  <td className="px-4 py-2 border-b">
                    {blog.images && blog.images.length > 0 ? (
                      <Image
                        src={Array.isArray(blog.images) ? blog.images[0] : blog.images}
                        alt={blog.title}
                        width={100} // Set appropriate width
                        height={100} // Set appropriate height
                        className="h-16 rounded object-cover"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      onClick={() => openEditForm(blog)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(blog)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold mb-4">
                {selectedBlog ? "Edit Blog" : "Add Blog"}
              </h2>
              <form
                onSubmit={handleFormSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded"
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
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this blog?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    clearSelectedBlog();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" >
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