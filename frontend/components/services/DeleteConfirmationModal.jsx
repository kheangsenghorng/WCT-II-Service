"use client";

import { motion } from "framer-motion";
import { AlertTriangle, XCircle, Loader2 } from "lucide-react";

export default function DeleteConfirmationModal({
  show,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}) {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
        variants={modalVariants}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirm Deletion
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{itemName}</span>? This action
                cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
