// app/admin/[id]/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";
import { useCategoryStore } from "@/store/useCateroyStore";
import { useTypeStore } from "@/store/useTypeStore";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import EditServiceModal from "@/components/services/EditServiceModal";
import DeleteConfirmationModal from "@/components/services/DeleteConfirmationModal";


export default function ServicesPage() {
  const router = useRouter();  // Initialize router
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

  useEffect(() => {
    if (ownerId) {
      fetchServicesByOwner(ownerId);
    }
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
                router.push(`/owner/${ownerId}/services/add`);  // Navigate to add service page
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              <Plus className="h-5 w-5" />
              Add New Service
            </button>
          </div>

          {/* Stats Display */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Total Services: {stats.total}
            {stats.total !== prevStats.total && (
              <span className="ml-2 text-xs text-blue-500">
                ({stats.total > prevStats.total ? "+" : ""}
                {stats.total - prevStats.total})
              </span>
            )}
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

          {/* Services Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border dark:border-gray-700">
            {servicesLoading ? (
              <div className="p-6 text-center text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {[
                        "ID",
                        "Name",
                        "Description",
                        "Price",
                        "Category",
                        "Type",
                        "Image",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {services.map((service, index) => {
                            const category = safeCategories.find(
                                (cat) => cat.id === service.service_categories_id
                            );
                            const type = safeTypes.find(
                                (t) => t.id === service.type_id
                            );

                            return (
                                <tr
                                    key={service.id}
                                    className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                                        } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {service.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                                        <div
                                            className="truncate"
                                            title={service.description}
                                        >
                                            {service.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        ${service.base_price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {category?.name || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {type?.name || "Unknown"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {service.images?.[0] ? (
                                            <img
                                                src={service.images[0]}
                                                alt={service.name}
                                                className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border">
                                                <ImageIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-3">
 <Link
   href={`/owner/${ownerId}/services/${service.id}/edit`}
   className="text-blue-500 font-bold py-2 rounded mr-2 inline-flex items-center"
 >
   <Edit className="w-8" />
 </Link>
 <button
   onClick={() => {
     setSelectedService(service);
     setShowDeleteModal(true);
   }}
   className="text-red-500 font-bold py-2 rounded inline-flex items-center"
 >
   <Trash2 className="w-8" />
 </button>
</div>
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

    {/* Edit Service Modal */}
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
