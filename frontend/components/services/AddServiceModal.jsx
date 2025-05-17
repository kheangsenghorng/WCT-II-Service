"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ImageIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function AddServiceModal({
  show,
  onClose,
  onSubmit,
  categories,
  types,
  loadingCategories,
  loadingTypes,
  onCategoryChange,
}) {
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceCategoryId, setNewServiceCategoryId] = useState("");
  const [newServiceBasePrice, setNewServiceBasePrice] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newServiceImages, setNewServiceImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clean up URLs
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      const isValidImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (isValidImage && isValidSize) {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    if (validFiles.length === 0) {
      setErrorMessage("Please upload valid image files (max 5MB).");
      return;
    }

    setErrorMessage(null);
    setNewServiceImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const updatedImages = [...newServiceImages];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setNewServiceImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const resetForm = () => {
    setNewServiceName("");
    setNewServiceDescription("");
    setNewServiceCategoryId("");
    setNewServiceBasePrice("");
    setNewServiceType("");
    setNewServiceImages([]);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (
      !newServiceName ||
      !newServiceCategoryId ||
      !newServiceBasePrice ||
      !newServiceType ||
      newServiceImages.length === 0
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (isNaN(newServiceBasePrice) || parseFloat(newServiceBasePrice) <= 0) {
      setErrorMessage("Please enter a valid positive price.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newServiceName);
    formData.append("description", newServiceDescription);
    formData.append("service_categories_id", newServiceCategoryId);
    formData.append("base_price", newServiceBasePrice);
    formData.append("type_id", newServiceType);

    newServiceImages.forEach((file, index) => {
      formData.append("images[]", file);
    });

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      resetForm();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to add service.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50 p-4"
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
            Add New Service
          </h3>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {errorMessage}
            </div>
          )}

          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Service Name *
            </label>
            <input
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter service name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={newServiceDescription}
              onChange={(e) => setNewServiceDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Enter service description"
            />
          </div>

          {/* Category and Type */}
          {/* Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                value={newServiceCategoryId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setNewServiceCategoryId(selectedId);
                  setNewServiceType(""); // Reset type when category changes
                  if (onCategoryChange) {
                    onCategoryChange(selectedId); // Trigger fetchTypesByCategoryId
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                disabled={loadingCategories}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {loadingCategories && (
                <p className="mt-1 text-xs text-gray-500">
                  Loading categories...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Service Type *
              </label>
              <select
                value={newServiceType}
                onChange={(e) => setNewServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                disabled={loadingTypes || !newServiceCategoryId} // Disable if no category
              >
                <option value="">Select type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {loadingTypes && (
                <p className="mt-1 text-xs text-gray-500">Loading types...</p>
              )}
            </div>
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Base Price *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                value={newServiceBasePrice}
                onChange={(e) => setNewServiceBasePrice(e.target.value)}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Service Images *
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG (max 5MB each)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Service
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
