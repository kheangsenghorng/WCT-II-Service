// DeleteConfirmation.jsx
import { motion } from "framer-motion";
import { useBlogStore } from "@/store/useBlogStore";

const DeleteConfirmation = ({ setShowConfirm }) => {
  const { selectedBlog, clearSelectedBlog, deleteBlog, fetchAllBlogs } =
    useBlogStore();

  const confirmDelete = async () => {
    if (selectedBlog) {
      await deleteBlog(selectedBlog.id);
      setShowConfirm(false);
      clearSelectedBlog();
      fetchAllBlogs();
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
  );
};

export default DeleteConfirmation;