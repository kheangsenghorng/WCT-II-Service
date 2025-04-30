"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, XCircle } from "lucide-react";

// Helper components for modals (reusable from previous examples)
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

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);  // State to hold the fetched categories

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceCategoryId, setNewServiceCategoryId] = useState("");

  const [selectedService, setSelectedService] = useState(null);
  const [deleteServiceId, setDeleteServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchCategories();  // Fetch categories when the component mounts
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/admin/services", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(`Error fetching services: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/categories", {  // Replace with your categories endpoint
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(`Error fetching categories: ${err.message}`);
    }
  };

  const addService = async () => {
    if (!newServiceName) {
      setError("Service name is required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_name: newServiceName,
          description: newServiceDescription,
          category_id: newServiceCategoryId, // Include category ID in the request
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewServiceName("");
      setNewServiceDescription("");
      setNewServiceCategoryId("");
      setShowAddModal(false);
      fetchServices();
    } catch (err) {
      setError(`Error adding service: ${err.message}`);
    }
  };

  const editService = async () => {
    if (!selectedService) return;

    try {
      const response = await fetch(`http://localhost:8000/api/admin/services/${selectedService.service_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_name: selectedService.service_name,
          description: selectedService.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShowEditModal(false);
      fetchServices();
    } catch (err) {
      setError(`Error editing service: ${err.message}`);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setShowDeleteModal(false);
      fetchServices();
    } catch (err) {
      setError(`Error deleting service: ${err.message}`);
    }
  };

  return (
    <motion.div
      className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Manage Services</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">Add, edit, or delete services.</p>

          {error && <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded mb-4">{error}</div>}

          <div className="mb-6">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Service
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-300">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <motion.div
                  key={service.service_id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{service.service_name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{service.description}</p>
                  <div className="flex justify-end mt-4 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setShowEditModal(true);
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <Edit className="h-4 w-4 mr-1 inline-block" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteServiceId(service.service_id);
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

          {/* Add Service Modal */}
          {showAddModal && (
            <ModalBackdrop onClick={() => setShowAddModal(false)}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Service</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Enter service name"
                />

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">Service Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  placeholder="Enter service description"
                />

                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    onChange={(e) => setNewServiceCategoryId(e.target.value)}
                    value={newServiceCategoryId}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>

                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addService}
                    className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
                  >
                    Add Service
                  </button>
                </div>
              </ModalContainer>
            </ModalBackdrop>
          )}

          {/* Edit Service Modal */}
          {showEditModal && selectedService && (
            <ModalBackdrop onClick={() => setShowEditModal(false)}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Edit Service</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={selectedService.service_name}
                  onChange={(e) => setSelectedService({ ...selectedService, service_name: e.target.value })}
                  placeholder="Enter service name"
                />

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2 mb-1">Service Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  value={selectedService.description}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  placeholder="Enter service description"
                />

                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editService}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
                  >
                    Save Changes
                  </button>
                </div>
              </ModalContainer>
            </ModalBackdrop>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && deleteServiceId && (
            <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Confirm Delete</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to delete this service?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteService(deleteServiceId)}
                    className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </ModalContainer>
            </ModalBackdrop>
          )}
        </main>
      </div>
    </motion.div>
  );
}