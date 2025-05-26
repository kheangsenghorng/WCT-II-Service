

"use client"// BlogPage.js (your main page)
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogStore } from "@/store/useBlogStore";
import BlogForm from "@/components/blog/BlogForm";
import BlogTable from "@/components/blog/BlogTable";
import { useParams } from "next/navigation";

export default function BlogPage() {
  const { id } = useParams();
  const adminId = id;

  const {
    blogs,
    fetchBlogs,
    setSelectedBlog,
    clearSelectedBlog,
    loading,
    deleteBlog,
    selectedBlog,
  } = useBlogStore();

  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchBlogs(adminId);
  }, [fetchBlogs, adminId]);

  const openAddForm = () => {
    clearSelectedBlog();
    setShowForm(true);
  };

  const openEditForm = (blog) => {
    setSelectedBlog(blog);
    setShowForm(true);
  };

  const openDeleteConfirm = (blog) => {
    setSelectedBlog(blog);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog?.id) return;

    try {
      await deleteBlog(selectedBlog.id);
      setShowConfirm(false);
      clearSelectedBlog();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
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

      {/* Blog Table */}
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

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <BlogForm
            key="blog-form"
            showForm={showForm}
            setShowForm={setShowForm}
            blog={selectedBlog}         // pass selected blog here
            adminId={adminId}           // pass admin id to form
            onSuccess={() => {
              setShowForm(false);
              clearSelectedBlog();
              fetchBlogs(adminId);      // refresh list after add/edit
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            key="delete-confirm"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
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
