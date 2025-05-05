"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, XCircle, ImageIcon } from "lucide-react";

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryImageFile, setNewCategoryImageFile] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/category`
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.data;
      setCategories(data);
    } catch (err) {
      setError(`Error fetching categories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/categories`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = response.data;
      return data.imageUrl;
    } catch (err) {
      setError(`Error uploading image: ${err.message}`);
      return null;
    }
  };

  const addCategory = async () => {
    if (!newCategoryName) {
      setError("Category name is required.");
      return;
    }

    let uploadedImageUrl = "";
    if (newCategoryImageFile) {
      uploadedImageUrl = await handleImageUpload(newCategoryImageFile);
      if (!uploadedImageUrl) return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/categories`,
        {
          category_name: newCategoryName,
          description: newCategoryDescription,
          image_url: uploadedImageUrl,
        }
      );

      if (response.status !== 201) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryImageFile(null); // Reset file input
      setShowAddModal(false);
      fetchCategories();
    } catch (err) {
      setError(`Error adding category: ${err.message}`);
    }
  };

  const editCategory = async () => {
    if (!selectedCategory) return;

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/categories/`,
        {
          category_name: selectedCategory.category_name,
          description: selectedCategory.description,
          image_url: selectedCategory.image_url,
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      setError(`Error editing category: ${err.message}`);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/categories/${categoryId}`
      );

      if (response.status !== 204) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShowDeleteModal(false);
      fetchCategories();
    } catch (err) {
      setError(`Error deleting category: ${err.message}`);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.category_id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {category.category_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {category.description}
              </p>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowEditModal(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <Edit className="h-4 w-4 mr-1 inline-block" /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteCategoryId(category.category_id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  <Trash2 className="h-4 w-4 mr-1 inline-block" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <ModalBackdrop onClick={() => setShowAddModal(false)}>
          <ModalContainer>
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
            <form onSubmit={addCategory}>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  htmlFor="categoryName"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1"
                  htmlFor="categoryDescription"
                >
                  Category Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="Enter category description"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1"
                  htmlFor="categoryImage"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) => setNewCategoryImageFile(e.target.files[0])}
                />
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCategory.category_name || ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  category_name: e.target.value,
                })
              }
              placeholder="Enter category name"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
              Category Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCategory.description || ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  description: e.target.value,
                })
              }
              placeholder="Enter category description"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">
              Image URL
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={selectedCategory.image_url || ""}
              onChange={(e) =>
                setSelectedCategory({
                  ...selectedCategory,
                  image_url: e.target.value,
                })
              }
              placeholder="Enter image URL"
            />
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={editCategory}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </ModalContainer>
        </ModalBackdrop>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteCategoryId && (
        <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCategory(deleteCategoryId)}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
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