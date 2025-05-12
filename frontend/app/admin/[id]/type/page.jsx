"use client";

import { useEffect, useState } from "react";
import { useTypeStore } from "@/store/useTypeStore";
import { useCategoryStore } from "@/store/useCateroyStore";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Plus, AlertTriangle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  exit: { opacity: 0, scale: 0.7, transition: { duration: 0.2 } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const AddTypeModal = ({ isOpen, onClose, onAddType, initialValues = {}, isEditing = false }) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [serviceCategoryId, setServiceCategoryId] = useState(initialValues?.categoryId || "");
  const [errorMessage, setErrorMessage] = useState(null);

  const { categories: serviceCategories } = useCategoryStore();

  useEffect(() => {
    setName(initialValues?.name || "");
    setServiceCategoryId(initialValues?.categoryId || "");
  }, [initialValues]);

  const handleSubmit = () => {
    if (!name.trim() || !serviceCategoryId) {
      setErrorMessage("Both name and category are required.");
      return;
    }
    setErrorMessage(null);
    onAddType(name, Number(serviceCategoryId));
    setName("");
    setServiceCategoryId("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-40"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {isEditing ? "Edit Type" : "Add New Type"}
            </h2>

            {errorMessage && (
              <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Type Name:
                </label>
                <input
                  type="text"
                  className="border rounded w-full py-2 px-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Select Category:
                </label>
                <select
  className="border rounded w-full py-2 px-3"
  value={serviceCategoryId}
  onChange={(e) => {
    setServiceCategoryId(e.target.value); // Update category ID
    console.log(e.target.value);  // Debugging to check the value
  }}
>
  <option value="">Select</option>
  {(serviceCategories || []).map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>


              </div>
            </div>

            <div className="flex justify-end mt-8 space-x-2">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Update" : "Add"} Type
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-40"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p className="text-gray-800 mb-4">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Type() {
  const {
    userTypes,
    fetchAllUserTypes,
    addUserType,
    updateUserType,
    deleteUserType,
    loading,
    error,
  } = useTypeStore();

  const { categories: serviceCategories, fetchCategories } = useCategoryStore();

  const [showModal, setShowModal] = useState(false);
  const [editValues, setEditValues] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchAllUserTypes();
    fetchCategories();
  }, []);

  const handleAddType = async (name, serviceCategoryId) => {
    try {
      if (editValues) {
        // Ensure serviceCategoryId is an array
        await updateUserType(editValues.id, name, serviceCategoryId);
        setSuccessMessage("Type updated successfully!");
      } else {
        console.log("Adding new Type", name, serviceCategoryId);
        await addUserType(name, serviceCategoryId);  // Here we pass serviceCategoryId as an array
        setSuccessMessage("Type added successfully!");
      }
      setEditValues(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error:", err);
    }
  };


  const handleEdit = (type) => {
    setEditValues({
      id: type.id,
      name: type.name,
      categoryId: Array.isArray(type.service_categories_id)
        ? type.service_categories_id[0]  // Assuming you only need one category ID here
        : type.service_categories_id,
    });
    setShowModal(true);
  };
  

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const getServiceCategoryName = (id) =>
    serviceCategories.find((cat) => cat.id === id)?.name || id;

  const handleConfirmDelete = async () => {
    await deleteUserType(confirmDeleteId);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Manage User Types
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-4">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => {
              setEditValues(null);
              setShowModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <Plus className="inline-block h-5 w-5 mr-1" />
            Add New Type
          </button>
        </div>

        <motion.div className="overflow-x-auto" variants={itemVariants}>
          <table className="min-w-full border border-gray-300 bg-white rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Created At</th>
                <th className="p-2 border">Updated At</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
    {userTypes.map((type, index) => (
      <motion.tr
        key={type.id}
        variants={itemVariants}
        className="hover:bg-gray-50 items-center cursor-pointer transition duration-200 ease-in-out"
      >
        <td className="p-2 border text-center">{index + 1}</td>
        <td className="p-2 border text-center">
          {Array.isArray(type.service_categories_id)
            ? type.service_categories_id.map(getServiceCategoryName).join(", ")
            : getServiceCategoryName(type.service_categories_id)}
        </td>
        <td className="p-2 border text-center">{type.name}</td>
        <td className="p-2 border text-center">
          {new Date(type.created_at).toLocaleDateString()}
        </td>
        <td className="p-2 border text-center">
          {new Date(type.updated_at).toLocaleDateString()}
        </td>
        <td className="p-2 border space-x-2 flex justify-center">
          <button
            onClick={() => handleEdit(type)}
            className="text-blue-500 font-bold py-2 rounded mr-2 inline-flex items-center"
            >
              <Edit className="w-8" />
          </button>
          <button
            onClick={() => handleDelete(type.id)}
            className="text-red-500 font-bold py-2 rounded inline-flex items-center"
                    >
                      <Trash2 className="w-8" />
          </button>
        </td>
      </motion.tr>
    ))}
    {!userTypes.length && (
      <tr>
        <td colSpan="6" className="text-center text-gray-500 p-4">
          No user types available.
        </td>
      </tr>
    )}
  </tbody>
          </table>
        </motion.div>
      </div>

      {/* Modals */}
      <AddTypeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditValues(null);
        }}
        onAddType={handleAddType}
        initialValues={editValues}
        isEditing={!!editValues}
      />

      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this user type?"
      />
    </motion.div>
  );
}