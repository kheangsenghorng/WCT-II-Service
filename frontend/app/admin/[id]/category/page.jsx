"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ImageIcon, CheckCircle } from "lucide-react";
import { useCategoryStore } from "@/store/useCateroyStore";

// Helper components for modals
const ModalBackdrop = ({ onClick, children }) => (
  <motion.div
    className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center"
    onClick={onClick}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);

const ModalContainer = ({ children, onClick }) => (
  <motion.div
    className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
    onClick={(e) => e.stopPropagation()}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
  >
    {children}
  </motion.div>
);

export default function CategoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    deleteCategory,
    setSelectedCategory,
    selectedCategory,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer); // Clear timer on unmount
    }
  }, [successMessage]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCategoryName);
    formData.append("description", newCategoryDescription);

    if (newCategoryImageFile && newCategoryImageFile instanceof File) {
      formData.append("image", newCategoryImageFile);
    }

    try {
      await addCategory(formData);
      setShowAddModal(false); // Close modal on success
      setSuccessMessage("Category added successfully!"); // Set sucess message
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      console.error("No selected category to edit");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedCategory.name);
    formData.append("description", selectedCategory.description);

    if (newCategoryImageFile && newCategoryImageFile instanceof File) {
      formData.append("image", newCategoryImageFile);
    }

    try {
      await editCategory(selectedCategory.slug, formData);
      setShowEditModal(false);
      setSuccessMessage("Category edited successfully!"); // Set sucess message
    } catch (err) {
      console.error("Error editing category:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategoryId) {
      console.error("No category ID to delete");
      return;
    }

    try {
      await deleteCategory(deleteCategoryId);
      setShowDeleteModal(false);
      setSuccessMessage("Category deleted successfully!"); // Set sucess message
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Manage Service Categories
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Add, edit, or delete service categories.
      </p>
      {successMessage && (
        <div className="bg-green-100 border border-green-500 text-green-700 py-3 px-4 rounded mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Category
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading categories...
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Image
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.slug}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-2">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <ImageIcon className="text-gray-400" />
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                    {category.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                    {category.description}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowEditModal(true);
                      }}
                      className="text-blue-500 font-bold py-2 rounded mr-2 inline-flex items-center"
                    >
                      <Edit className="w-8" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category); // Select category to be deleted
                        setDeleteCategoryId(category.slug); // Ensure you are using the correct identifier (slug)
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 font-bold py-2 rounded inline-flex items-center"
                    >
                      <Trash2 className="w-8" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{/* Add Category Modal */}
 {showAddModal && (
  <ModalBackdrop onClick={() => setShowAddModal(false)}>
   <ModalContainer onClick={(e) => e.stopPropagation()}>
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
     Add New Category
    </h3>
    {error && (
     <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded shadow-md mb-4 flex items-center justify-between">
      <div>
       <AlertTriangle className="w-5 h-5 mr-2 inline-block" />
       {error}
      </div>
      <button
       onClick={() => setError(null)}
       className="text-red-700 hover:text-red-900"
      >
       Dismiss
      </button>
     </div>
    )}
    {successMessage && (
     <div className="bg-green-100 border border-green-500 text-green-700 py-3 px-4 rounded shadow-md mb-4 flex items-center justify-between">
      <div>
       <CheckCircle className="w-5 h-5 mr-2 inline-block" />
       {successMessage}
      </div>
      <button
       onClick={() => setSuccessMessage(null)}
       className="text-green-700 hover:text-green-900"
      >
       Dismiss
      </button>
     </div>
    )}
    <form onSubmit={handleAddCategory}>
     <div className="mb-4">
      <label
       htmlFor="name"
       className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
      >
       Category Name
      </label>
      <input
       type="text"
       id="name"
       value={newCategoryName}
       onChange={(e) => setNewCategoryName(e.target.value)}
       className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600"
       required
      />
     </div>
     <div className="mb-4">
      <label
       htmlFor="description"
       className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
      >
       Description
      </label>
      <textarea
       id="description"
       value={newCategoryDescription}
       onChange={(e) => setNewCategoryDescription(e.target.value)}
       className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600"
       rows="4"
       required
      />
     </div>
     <div className="mb-4">
      <label
       htmlFor="image"
       className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
      >
       Category Image (optional)
      </label>
      <input
       type="file"
       id="image"
       accept="image/*"
       onChange={(e) => setNewCategoryImageFile(e.target.files[0])}
       className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600"
      />
     </div>
     <div className="flex justify-end space-x-3">
      <button
       onClick={() => setShowAddModal(false)}
       type="button"
       className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
      >
       Cancel
      </button>
      <button
       type="submit"
       className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
      >
       Add Category
      </button>
     </div>
    </form>
   </ModalContainer>
  </ModalBackdrop>
 )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <ModalBackdrop onClick={() => setShowEditModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Edit Category
            </h3>
            <form onSubmit={handleEditCategory}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={selectedCategory?.name || ""}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={selectedCategory?.description || ""}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  New Category Image (optional)
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setNewCategoryImageFile(e.target.files[0])}
                  className="w-full px-4 py-2 border rounded-lg text-sm text-gray-800 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  type="button"
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </ModalContainer>
        </ModalBackdrop>
      )}

      {/* Delete Category Modal */}
      {showDeleteModal && (
        <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </motion.div>
  );
}