"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Plus,
  Search,
} from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";
import { useCategoryStore } from "@/store/useCateroyStore";
import { useTypeStore } from "@/store/useTypeStore";
import { useParams, useRouter } from "next/navigation";
import EditServiceModal from "@/components/services/EditServiceModal";
import DeleteConfirmationModal from "@/components/services/DeleteConfirmationModal";

export default function ServicesPage() {
  const router = useRouter();
  const { id: ownerId } = useParams();

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    fetchServicesByOwner,
    updateService,
    deleteService,
  } = useServicesStore();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategoriesOwner,
  } = useCategoryStore();

  const {
    types,
    loading: typesLoading,
    error: typesError,
    fetchTypes,
    fetchTypesByCategory,
  } = useTypeStore();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [stats, setStats] = useState({ total: 0 });
  const [prevStats, setPrevStats] = useState({ total: 0 });

  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    if (ownerId) fetchServicesByOwner(ownerId);
  }, [ownerId, fetchServicesByOwner]);

  useEffect(() => {
    fetchCategoriesOwner();
    fetchTypes();
  }, [fetchCategoriesOwner, fetchTypes]);

  useEffect(() => {
    const error = servicesError || categoriesError || typesError;
    if (error) setErrorMessage(error);
  }, [servicesError, categoriesError, typesError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (services.length >= 0) {
      setPrevStats(stats);
      setStats({ total: services.length });
    }
  }, [services]);

  const handleEditService = async (serviceId, formData) => {
    try {
      await updateService(serviceId, formData);
      setSuccessMessage("Service updated successfully!");
      setErrorMessage(null);
      fetchServicesByOwner(ownerId);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update service.");
    }
  };

  const handleDeleteService = async () => {
    try {
      await deleteService(ownerId, selectedService.id);
      setSuccessMessage("Service deleted successfully!");
      setErrorMessage(null);
      setShowDeleteModal(false);
      fetchServicesByOwner(ownerId);
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete service.");
    }
  };

  const safeCategories = categories || [];
  const safeTypes = types || [];

  const filteredServices = services.filter((service) => {
    const category = safeCategories.find(
      (cat) => cat.id === service.service_categories_id
    );
    const matchesCategory = filterCategory
      ? category?.name?.toLowerCase().includes(filterCategory.toLowerCase())
      : true;
    const matchesSearch = searchTerm
      ? service.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Price filtering
    const price = Number.parseFloat(service.base_price);
    const minPrice = priceRange.min ? Number.parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max
      ? Number.parseFloat(priceRange.max)
      : Number.POSITIVE_INFINITY;
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (servicesError || categoriesError || typesError)
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {servicesError ||
            categoriesError ||
            typesError ||
            "An error occurred while fetching data."}
        </div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Manage Services
            </h1>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => {
                router.push(`/owner/${ownerId}/services/add`);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              <Plus className="h-5 w-5" />
              Add New Service
            </button>
          </div>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Total Services: {stats.total}
            {stats.total !== prevStats.total && (
              <span className="ml-2 text-xs text-blue-500">
                ({stats.total > prevStats.total ? "+" : ""}
                {stats.total - prevStats.total})
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs mt-3 sm:mt-0">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="relative w-full sm:max-w-xs">
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {safeCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center gap-2 w-full sm:max-w-xs">
              <input
                type="number"
                placeholder="Min $"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max $"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setFilterCategory("");
                setSearchTerm("");
                setPriceRange({ min: "", max: "" });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div
                className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 py-2 px-4 rounded-lg shadow-md z-[100] flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key="success"
              >
                <CheckCircle className="w-5 h-5" />
                {successMessage}
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 py-2 px-4 rounded-lg shadow-md z-[100] flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key="error"
              >
                <AlertTriangle className="w-5 h-5" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Service Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {servicesLoading ? (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Loading services...
                  </p>
                </div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No services found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm ||
                  filterCategory ||
                  priceRange.min ||
                  priceRange.max
                    ? "Try adjusting your filters"
                    : "Get started by adding your first service"}
                </p>
                <button
                  onClick={() => router.push(`/owner/${ownerId}/services/add`)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Add New Service
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
                      {[
                        { key: "ID", label: "ID" },
                        { key: "Name", label: "Service" },
                        { key: "Price", label: "Price" },
                        { key: "Category", label: "Category" },
                        { key: "Type", label: "Type" },
                        { key: "Actions", label: "Actions" },
                      ].map((header) => (
                        <th
                          key={header.key}
                          className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredServices.map((service, index) => {
                      const category = safeCategories.find(
                        (cat) => cat.id === service.service_categories_id
                      );
                      const type = safeTypes.find(
                        (t) => t.id === service.type_id
                      );

                      return (
                        <motion.tr
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
                        >
                          {/* ID */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full">
                              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                {index + 1}
                              </span>
                            </div>
                          </td>

                          {/* Name */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-x-4">
                              {/* Image */}
                              <div className="relative">
                                {service.images?.[0] ? (
                                  <div className="relative group/image">
                                    <img
                                      src={
                                        service.images[0] || "/placeholder.svg"
                                      }
                                      alt={service.name}
                                      className="h-12 w-12 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-all duration-200"
                                    />
                                    <div className="absolute inset-0 bg-opacity-0 group-hover/image:bg-opacity-20 rounded-xl transition-all duration-200"></div>
                                  </div>
                                ) : (
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              {/* Name */}
                              <div className="flex flex-col justify-center">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                  {service.name}
                                </span>
                                {/* <span className="text-xs text-gray-500 dark:text-gray-400">ID: {service.id}</span> */}
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-lg font-bold ">
                                ${service.base_price}
                              </span>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {category?.name || "Unknown"}
                            </span>
                          </td>

                          {/* Type */}
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {type?.name || "Unknown"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/owner/${ownerId}/services/${service.id}/edit`}
                                className="group/edit p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md"
                              >
                                <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/edit:scale-110 transition-transform" />
                              </Link>
                              <button
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowDeleteModal(true);
                                }}
                                className="group/delete p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all duration-200 hover:shadow-md"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover/delete:scale-110 transition-transform" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <EditServiceModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          service={selectedService}
          onSubmit={handleEditService}
          categories={categories}
          types={types}
          loadingCategories={categoriesLoading}
          loadingTypes={typesLoading}
          onCategoryChange={(categoryId) => fetchTypesByCategory(categoryId)}
        />

        <DeleteConfirmationModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteService}
          itemName={selectedService?.name || "this service"}
          isDeleting={servicesLoading}
        />
      </main>
    </div>
  );
}
