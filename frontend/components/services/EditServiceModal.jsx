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
}) {
  const [editedServiceName, setEditedServiceName] = useState("");
  const [editedServiceDescription, setEditedServiceDescription] = useState("");
  const [editedServiceCategoryId, setEditedServiceCategoryId] = useState("");
  const [editedServiceBasePrice, setEditedServiceBasePrice] = useState("");
  const [editedServiceType, setEditedServiceType] = useState("");
  const [editedServiceImage, setEditedServiceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateService, loading, error, fetchServicesByOwner } =
    useServicesStore();
  const { id: ownerId } = useParams();

  useEffect(() => {
    if (service) {
      setEditedServiceName(service.name || "");
      setEditedServiceDescription(service.description || "");
      setEditedServiceCategoryId(service.service_categories_id || "");
      setEditedServiceBasePrice(service.base_price || "");
      setEditedServiceType(service.type_id || "");
      setImagePreview(service.images?.[0] || null);
    }
  }, [service]);

  useEffect(() => {
    if (ownerId) {
      fetchServicesByOwner(ownerId);
    }
  }, [ownerId, fetchServicesByOwner]);

  useEffect(() => {
    return () => {
      if (imagePreview && typeof imagePreview === "string") {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (isValidImage && isValidSize) {
        setEditedServiceImage(file);
        setImagePreview(URL.createObjectURL(file));
        setErrorMessage(null);
      } else {
        setErrorMessage("Please upload a valid image file (max 5MB).");
        setImagePreview(null);
      }
    }
  };

  const resetForm = () => {
    setEditedServiceName("");
    setEditedServiceDescription("");
    setEditedServiceCategoryId("");
    setEditedServiceBasePrice("");
    setEditedServiceType("");
    setEditedServiceImage(null);
    setImagePreview(null);
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
    if (editedServiceImage) {
      formData.append("images", editedServiceImage);
    }

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
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={editedServiceDescription}
              onChange={(e) => setEditedServiceDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Enter service description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={editedServiceCategoryId}
                onChange={(e) => setEditedServiceCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                disabled={loadingCategories}
              >
                <option value="">Select a category</option>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Type *
              </label>
              <select
                value={editedServiceType}
                onChange={(e) => setEditedServiceType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                disabled={loadingTypes}
              >
                <option value="">Select a type</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Base Price *
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={editedServiceBasePrice}
                onChange={(e) => setEditedServiceBasePrice(e.target.value)}
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Service Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG (MAX. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={
                      typeof imagePreview === "string"
                        ? imagePreview
                        : URL.createObjectURL(imagePreview)
                    }
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditedServiceImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Update Service
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
