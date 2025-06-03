import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.25, ease: "easeOut" } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeInOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25, ease: "easeIn" } },
};

const backdropVariants = {
  hidden: { opacity: 0, transition: { duration: 0.25 } },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const ConfirmDeleteUserModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={backdropVariants}
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-md"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        <h3 className="text-2xl font-semibold text-red-600 dark:text-red-400">
          Confirm Deletion
        </h3>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="mt-8 flex justify-center space-x-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-300 ease-in-out"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDeleteUserModal;
