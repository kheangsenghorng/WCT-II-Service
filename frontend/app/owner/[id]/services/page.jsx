"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ImageIcon, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";
import { useParams } from "next/navigation";

export default function ServicesPage() {
  const { id: ownerId } = useParams();
  const {
    categories = [],
    serviceTypes = [],
    services = [],
    loadingServiceTypes,
    loadingCategories,
    loadingServices,
    fetchServices,
    fetchCategories,
    fetchServiceTypes,
    addService,
  } = useServicesStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceCategoryId, setNewServiceCategoryId] = useState("");
  const [newServiceBasePrice, setNewServiceBasePrice] = useState("");
  const [newServiceType, setNewServiceType] = useState("");
  const [newServiceImage, setNewServiceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ownerId) {
      fetchServices(ownerId);
      fetchCategories();
      fetchServiceTypes();
    }
  }, [ownerId, fetchServices, fetchCategories, fetchServiceTypes]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
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
        setNewServiceImage(file);
        setImagePreview(URL.createObjectURL(file));
        setErrorMessage(null);
      } else {
        setErrorMessage("Please upload a valid image file (max 5MB).");
        setImagePreview(null);
      }
    }
  };

  const resetForm = () => {
    setNewServiceName("");
    setNewServiceDescription("");
    setNewServiceCategoryId("");
    setNewServiceBasePrice("");
    setNewServiceType("");
    setNewServiceImage(null);
    setImagePreview(null);
  };

  const handleAddService = async () => {
    if (!newServiceName || !newServiceCategoryId || !newServiceBasePrice || !newServiceType || !newServiceImage) {
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
    formData.append("image", newServiceImage);

    setIsSubmitting(true);
    try {
      await addService(ownerId, formData);
      setSuccessMessage("Service added successfully!");
      setErrorMessage(null);
      resetForm();
      setShowAddModal(false);
      await fetchServices(ownerId); // Refresh the list
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Manage Services</h1>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-5 w-5" />
              Add New Service
            </button>
          </div>

          {/* Status Messages */}
          {successMessage && (
            <motion.div 
              className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 py-2 px-4 rounded-lg shadow-md z-50 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div 
              className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg shadow-md z-50 flex items-center gap-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertTriangle className="w-5 h-5" />
              {errorMessage}
            </motion.div>
          )}

          {/* Services Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {loadingServices ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No services available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {services.map((service) => {
                      const category = categories.find(cat => cat.category_id === service.service_categories_id);
                      const type = serviceTypes.find(t => t.id === service.type_id);

                      return (
                        <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                            {service.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            ${service.base_price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {category?.category_name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {type?.name || "Unknown"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {service.image ? (
                              <img 
                                src={service.image} 
                                alt={service.name} 
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Service Modal */}
        {showAddModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Service</h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name *</label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter service name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    rows={3}
                    placeholder="Enter service description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                    <select
                      value={newServiceCategoryId}
                      onChange={(e) => setNewServiceCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                      disabled={loadingCategories}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                    {loadingCategories && (
                      <p className="mt-1 text-xs text-gray-500">Loading categories...</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type *</label>
                    <select
                      value={newServiceType}
                      onChange={(e) => setNewServiceType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                      disabled={loadingServiceTypes}
                    >
                      <option value="">Select a type</option>
                      {serviceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {loadingServiceTypes && (
                      <p className="mt-1 text-xs text-gray-500">Loading types...</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Base Price *</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={newServiceBasePrice}
                      onChange={(e) => setNewServiceBasePrice(e.target.value)}
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Image *</label>
                  <div className="mt-1 flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
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
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewServiceImage(null);
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
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddService}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Add Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}