"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogStore } from "@/store/useBlogStore";
import BlogForm from "@/components/blog/BlogForm";
import BlogTable from "@/components/blog/BlogTable";
import { useParams } from "next/navigation";

export default function BlogPage() {
  const { id } = useParams(); // id from URL params, string type
  const adminId = id; // optionally convert to number if needed: Number(id);

  const {
    blogs,
    fetchBlogs,
    selectBlog,
    clearSelectedBlog,
    loading,
    deleteBlog,
  } = useBlogStore();

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // If fetchBlogs accepts adminId, pass it here:
    fetchBlogs(adminId);
  }, [fetchBlogs, adminId]);

  const openAddForm = () => {
    clearSelectedBlog?.();
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    selectBlog?.(blog);
    setShowForm(true);
  };

  const openDeleteConfirm = (blog) => {
    selectBlog?.(blog);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteBlog();
    setShowConfirm(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Blog Management
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Blog
        </button>
      </div>

      {/* Blog Table or Loading */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading blogs...
        </p>
      ) : (
        <BlogTable
          blogs={blogs}
          openEditForm={openEditForm}
          openDeleteConfirm={openDeleteConfirm}
        />
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BlogForm
            key="blog-form"
            showForm={showForm}
            setShowForm={setShowForm}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            key="delete-confirm"
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm"
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
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                >
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
