"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ImageIcon, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";
import { useParams } from "next/navigation";

export default function EditServiceModal({
  show,
  onClose,
  service,
  onSubmit,
  categories,
  types,
  loadingCategories,
  loadingTypes,
  onCategoryChange,
}) {
  const [editedServiceName, setEditedServiceName] = useState("");
  const [editedServiceDescription, setEditedServiceDescription] = useState("");
  const [editedServiceCategoryId, setEditedServiceCategoryId] = useState("");
  const [editedServiceBasePrice, setEditedServiceBasePrice] = useState("");
  const [editedServiceType, setEditedServiceType] = useState("");

  // For multiple images:
  const [editedServiceImages, setEditedServiceImages] = useState([]); // files selected
  const [imagePreviews, setImagePreviews] = useState([]); // URLs for previews

  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    updateService,
    loading,
    error,
    fetchServicesByOwner,
    deleteServiceImage,
  } = useServicesStore();
  const { id: ownerId } = useParams();

  // Initialize form fields when service changes
  useEffect(() => {
    if (service) {
      setEditedServiceName(service.name || "");
      setEditedServiceDescription(service.description || "");
      setEditedServiceCategoryId(service.service_categories_id || "");
      setEditedServiceBasePrice(service.base_price || "");
      setEditedServiceType(service.type_id || "");

      // For images, load existing URLs from service.images array:
      if (service.images && Array.isArray(service.images)) {
        setImagePreviews(service.images); // URLs from backend
      } else {
        setImagePreviews([]);
      }

      setEditedServiceImages([]); // reset chosen files
      setErrorMessage(null);
    }
  }, [service]);

  useEffect(() => {
    if (ownerId) {
      fetchServicesByOwner(ownerId);
    }
  }, [ownerId, fetchServicesByOwner]);

  // Cleanup preview URLs when component unmounts or previews change (for object URLs)
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (typeof preview !== "string") {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  // Handle new file selection (multiple files)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate each file (image type & size <=5MB)
    const validFiles = files.filter((file) => {
      const isValidImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidImage && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrorMessage(
        "Some files were invalid or larger than 5MB and were ignored."
      );
    } else {
      setErrorMessage(null);
    }

    // Create preview URLs for new valid files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));

    // Append new files and previews to existing state
    setEditedServiceImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove image by index (either existing URL or newly added file)
  const removeImageAtIndex = async (index) => {
    const previewToRemove = imagePreviews[index];

    if (
      typeof previewToRemove === "string" &&
      service?.images.includes(previewToRemove)
    ) {
      // It's an existing image from the backend
      try {
        await deleteServiceImage(service.id, previewToRemove);
      } catch (error) {
        console.error("Failed to delete image from server:", error);
        setErrorMessage("Failed to delete image from server.");
        return;
      }
    } else {
      // It's a newly added image (local file)
      const newImagesStartIndex =
        imagePreviews.length - editedServiceImages.length;
      const fileIndex = index - newImagesStartIndex;

      if (fileIndex >= 0) {
        setEditedServiceImages((prev) =>
          prev.filter((_, i) => i !== fileIndex)
        );
      }

      // Revoke object URL for memory cleanup
      URL.revokeObjectURL(previewToRemove);
    }

    // Remove preview from list
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setEditedServiceName("");
    setEditedServiceDescription("");
    setEditedServiceCategoryId("");
    setEditedServiceBasePrice("");
    setEditedServiceType("");
    setEditedServiceImages([]);
    setImagePreviews([]);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (
      !editedServiceName ||
      !editedServiceCategoryId ||
      !editedServiceBasePrice ||
      !editedServiceType
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (
      isNaN(editedServiceBasePrice) ||
      parseFloat(editedServiceBasePrice) <= 0
    ) {
      setErrorMessage("Please enter a valid positive price.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editedServiceName);
    formData.append("description", editedServiceDescription);
    formData.append("service_categories_id", editedServiceCategoryId);
    formData.append("base_price", editedServiceBasePrice);
    formData.append("type_id", editedServiceType);

    // Append each file with key "images[]"
    editedServiceImages.forEach((file) => {
      formData.append("images[]", file);
    });

    setIsSubmitting(true);
    try {
      await updateService({
        ownerId,
        serviceId: service.id,
        formData,
      });
      resetForm();
      onClose();
      fetchServicesByOwner(ownerId);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update service.");
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
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        variants={modalVariants}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Service
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              value={editedServiceName}
              onChange={(e) => setEditedServiceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter service name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editedServiceDescription}
              onChange={(e) => setEditedServiceDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter service description"
              rows={3}
            />
          </div>

          {/* Category */}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            {loadingCategories ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Loading categories...
              </div>
            ) : (
              <select
                value={editedServiceCategoryId}
                onChange={(e) => {
                  setEditedServiceCategoryId(e.target.value);
                  if (onCategoryChange) onCategoryChange(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Base Price (USD) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editedServiceBasePrice}
              onChange={(e) => setEditedServiceBasePrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter base price"
            />
          </div>

          {/* Type */}
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type *
            </label>
            {loadingTypes ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Loading types...
              </div>
            ) : (
              <select
                value={editedServiceType}
                onChange={(e) => setEditedServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />

            {/* Preview images */}
            <div className="mt-3 flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-300 dark:border-gray-600"
                >
                  <img
                    src={typeof preview === "string" ? preview : preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => removeImageAtIndex(index)}
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
                    title="Remove image"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading || isSubmitting}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="inline animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Service"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
