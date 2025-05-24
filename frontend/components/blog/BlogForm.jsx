import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useBlogStore } from "@/store/useBlogStore";
import Image from "next/image";

const BlogForm = ({ showForm, setShowForm }) => {
  const {
    selectedBlog,
    addBlog,
    updateBlog,
    clearSelectedBlog,
    formData,
    setFormData,
    handleImageChange,
    revokePreviewUrl,
    formError,
    setFormError,
  } = useBlogStore();
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => revokePreviewUrl();
  }, [revokePreviewUrl]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim() || !formData.content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      if (selectedBlog) {
        await updateBlog(selectedBlog.id, data);
      } else {
        await addBlog(data);
      }

      setShowForm(false);
      clearSelectedBlog();
      revokePreviewUrl();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Submit error:", error);
      setFormError("Failed to save blog.");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {formError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) =>
                setFormData({ content: e.target.value })
              }
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {formData.previewUrl && (
            <div className="relative w-20 h-20 rounded overflow-hidden mt-2">
              <Image
                src={formData.previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                clearSelectedBlog();
                revokePreviewUrl();
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
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
  );
};

export default BlogForm;
