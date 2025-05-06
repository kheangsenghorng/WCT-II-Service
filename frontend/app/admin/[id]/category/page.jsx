"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, XCircle, ImageIcon } from "lucide-react";
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
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", selectedCategory.name);
    formData.append("description", selectedCategory.description);

    if (newCategoryImageFile && newCategoryImageFile instanceof File) {
      formData.append("image", newCategoryImageFile);
    }

    formData.append("_method", "PUT"); // Laravel compatibility

    try {
      await editCategory(selectedCategory.slug, formData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing category:", error);
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
                  key={category.id}
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
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      <Edit className="h-4 w-4 inline-block mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteCategory(category.id);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      <Trash2 className="h-4 w-4 inline-block mr-1" /> Delete
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Add New Category
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Description
                </label>
                <textarea
                  id="categoryDescription"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Enter category description"
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryImage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Upload Image
                </label>
                <input
                  id="categoryImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setNewCategoryImageFile(file);
                  }}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddModal(false);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Edit Category
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditCategory}>
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter category name"
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Category Description
                </label>
                <textarea
                  id="categoryDescription"
                  value={selectedCategory.description}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter category description"
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryImage"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Upload Image
                </label>
                <input
                  id="categoryImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setNewCategoryImageFile(file);
                  }}
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </ModalContainer>
        </ModalBackdrop>
      )}
    </motion.div>
  );
}
