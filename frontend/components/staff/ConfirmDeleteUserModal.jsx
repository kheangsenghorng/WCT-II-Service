// components/users/ConfirmDeleteUserModal.jsx
import React from "react";
import { motion } from "framer-motion";

const ConfirmDeleteUserModal = ({ isOpen, onClose, onConfirm }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        <p className="mt-4">
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmDeleteUserModal;