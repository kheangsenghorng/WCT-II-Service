// BlogForm.jsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import Image from "next/image";
import { useParams } from "next/navigation";

const BlogForm = ({ showForm, setShowForm }) => {
  const { id: adminId } = useParams();
  const selectedBlog = useBlogStore((state) => state.selectedBlog);
  const { clearSelectedBlog, fetchBlogs, createBlog, updateBlog } =
    useBlogStore();

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    previewUrl: null,
  });

  const fileInputRef = useRef();

  useEffect(() => {
    if (selectedBlog) {
      setFormData({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
        image: null,
        previewUrl: selectedBlog.image || selectedBlog.image_url || null, // fallback if image_url is used
      });
    } else {
      setFormData({
        title: "",
        content: "",
        image: null,
        previewUrl: null,
      });
    }
  }, [selectedBlog]);

  const revokePreviewUrl = () => {
    // Only revoke if previewUrl was created by URL.createObjectURL (i.e. if image is File)
    if (formData.previewUrl && formData.image) {
      URL.revokeObjectURL(formData.previewUrl);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      revokePreviewUrl();
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("admin_id", adminId);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (selectedBlog) {
        await updateBlog(selectedBlog.id, data);
      } else {
        await createBlog(data, adminId);
      }

      await fetchBlogs();
      handleCancel();
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    clearSelectedBlog();
    revokePreviewUrl();
    setFormData({
      title: "",
      content: "",
      image: null,
      previewUrl: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!showForm) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          {selectedBlog ? "Edit Blog" : "Add Blog"}
        </h2>

        {formError && (
          <div
            className="bg-red-100 text-red-700 p-3 rounded mb-4"
            role="alert"
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange("title")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              autoFocus
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={4}
              value={formData.content}
              onChange={handleChange("content")}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Image
            </label>
            <input
              id="image"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={submitting}
            />
          </div>

          {formData.previewUrl && (
            <div className="relative w-20 h-20 rounded overflow-hidden mt-2">
              <Image
                src={formData.previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={formData.image !== null} // avoid Next.js image optimization for object URLs
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
              disabled={submitting}
            >
              {selectedBlog ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BlogForm;
