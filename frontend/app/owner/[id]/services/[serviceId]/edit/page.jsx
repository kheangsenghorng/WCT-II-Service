"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ImageIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";
import { useCategoryStore } from "@/store/useCateroyStore";
import { useTypeStore } from "@/store/useTypeStore";
import { useParams, useRouter } from "next/navigation";

export default function EditServicePage() {
  const router = useRouter();
  const { id: ownerId, serviceId } = useParams();

  const {
    service,
    fetchService,
    updateService,
    deleteServiceImage,
    loading: servicesLoading,
    error: servicesError,
  } = useServicesStore();

  const {
    categories,
    loading: categoriesLoading,
    fetchCategoriesOwner,
  } = useCategoryStore();

  const {
    types,
    loading: typesLoading,
    fetchTypes,
    fetchTypesByCategory,
  } = useTypeStore();

  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceCategoryId, setNewServiceCategoryId] = useState("");
  const [newServiceBasePrice, setNewServiceBasePrice] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newServiceImages, setNewServiceImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoadingService, setIsLoadingService] = useState(true);
  const [editedServiceImages, setEditedServiceImages] = useState([]); // files selected

  useEffect(() => {
    fetchCategoriesOwner();
    fetchTypes();
  }, [fetchCategoriesOwner, fetchTypes]);

  useEffect(() => {
    if (ownerId && serviceId) {
      fetchService(ownerId, serviceId);
    }
  }, [ownerId, serviceId, fetchService]);

  useEffect(() => {
    if (servicesLoading) return;

    if (service) {
      setNewServiceName(service.name || "");
      setNewServiceDescription(service.description || "");
      setNewServiceCategoryId(service.service_categories_id || "");
      setNewServiceBasePrice(String(service.base_price) || "");
      setNewServiceType(service.type_id || "");
      setIsLoadingService(false);
      if (service.images && Array.isArray(service.images)) {
        setImagePreviews(service.images); // URLs from backend
      } else {
        setImagePreviews([]);
      }
    } else {
      setIsLoadingService(false);
    }
  }, [service, serviceId, servicesLoading]);

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

  // const removeImage = (index) => {
  //   const updatedImages = [...newServiceImages];
  //   const updatedPreviews = [...imagePreviews];
  //   updatedImages.splice(index, 1);
  //   URL.revokeObjectURL(updatedPreviews[index]);
  //   updatedPreviews.splice(index, 1);
  //   setNewServiceImages(updatedImages);
  //   setImagePreviews(updatedPreviews);
  // };

  const resetForm = () => {
    setNewServiceName("");
    setNewServiceDescription("");
    setNewServiceCategoryId("");
    setNewServiceBasePrice("");
    setNewServiceType("");
    newServiceImages.forEach((_, i) => URL.revokeObjectURL(imagePreviews[i]));
    setNewServiceImages([]);
    setImagePreviews([]);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (
      !newServiceName ||
      !newServiceCategoryId ||
      !newServiceBasePrice ||
      !newServiceType
      // images not required to update? If yes, uncomment this line:
      // || newServiceImages.length === 0
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (
      isNaN(parseFloat(newServiceBasePrice)) ||
      parseFloat(newServiceBasePrice) <= 0
    ) {
      setErrorMessage("Please enter a valid positive price.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newServiceName);
    formData.append("description", newServiceDescription);
    formData.append("service_categories_id", newServiceCategoryId);
    formData.append("base_price", newServiceBasePrice);
    formData.append("type_id", newServiceType);

    newServiceImages.forEach((file) => {
      formData.append("images[]", file);
    });

    setIsSubmitting(true);
    try {
      await updateService(ownerId, serviceId, formData);

      resetForm();
      setSuccessMessage("Service updated successfully!");
      router.push(`/owner/${ownerId}/services`);
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.message ||
            `Failed to update service: status code ${err.response.status}`
        );
      } else {
        setErrorMessage(err.message || "Failed to update service.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
        await fetchService(ownerId, serviceId);
      } catch (error) {
        console.error("Failed to delete image from server:", error);
        setErrorMessage("Failed to delete image from server.");
        return;
      }
    } else {
      // It's a newly added image (local file)
      const newImagesStartIndex =
        imagePreviews.length - newServiceImages.length;
      const fileIndex = index - newImagesStartIndex;

      if (fileIndex >= 0) {
        setNewServiceImages((prev) => prev.filter((_, i) => i !== fileIndex));
      }

      // Revoke object URL for memory cleanup

      URL.revokeObjectURL(previewToRemove);
    }

    // Remove preview from list
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const goBack = () => {
    resetForm();
    router.back();
  };

  if (isLoadingService) {
    return (
      <motion.div
        className="container mx-auto p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 rounded-lg shadow-md flex justify-center items-center">
          Loading Data...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Edit Service
          </h1>
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" />
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 py-2 px-4 rounded-lg flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        <div className="space-y-4">
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
                  if (fetchTypesByCategory) {
                    fetchTypesByCategory(selectedId); // Trigger fetchTypesByCategoryId
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                disabled={categoriesLoading}
              >
                <option value="">Select category</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
              {categoriesLoading && (
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
                disabled={typesLoading || !newServiceCategoryId} // Disable if no category
              >
                <option value="">Select type</option>
                {types &&
                  types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
              </select>
              {typesLoading && (
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
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={goBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}
