"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBookingStoreFetch } from "@/store/bookingStore";
import {
  Mail,
  Calendar,
  DollarSign,
  ChevronRight,
  Users,
  BookOpen,
  Grid3X3,
  List,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GuestListPage() {
  const params = useParams();
  const router = useRouter();

  const ownerId = params?.id;
  const serviceId = params?.serviceId || params?.serviesId;

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const itemsPerPage = viewMode === "cards" ? 12 : 10;

  const {
    fetchServiceBookings,
    userBookings = [],
    stats,
    loading,
    error,
  } = useBookingStoreFetch();

  useEffect(() => {
    if (ownerId && serviceId) {
      fetchServiceBookings(ownerId, serviceId);
    }
  }, [ownerId, serviceId, fetchServiceBookings]);

  const totalGuests = userBookings.length;
  const totalPages = Math.ceil(totalGuests / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBookings = userBookings.slice(startIndex, endIndex);

  const handleCardClick = (guest) => {
    const guestUserId = guest.user?.id || "unknownUser";
    router.push(
      `/owner/${ownerId}/booking/${serviceId}/${guestUserId}/${guest?.bookings[0]?.id}`
    );
  };

  const handleRowClick = (guest) => {
    const guestUserId = guest.user?.id || "unknownUser";
    router.push(
      `/owner/${ownerId}/booking/${serviceId}/${guestUserId}/${guest?.bookings[0]?.id}`
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <h3 className="font-semibold mb-2">Error Loading Guest Data</h3>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Guest List
              </h1>
              <p className="text-gray-600">
                Manage and view all your service bookings
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === "cards"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Cards</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm font-medium">Table</span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Total Bookings: {stats?.total_booking_count || 0}
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Total Users: {stats?.unique_users_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        <AnimatePresence mode="wait">
          {viewMode === "cards" ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Guest Cards Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              >
                {paginatedBookings.map((guest, index) => (
                  <motion.div
                    key={guest.id || index}
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleCardClick(guest)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={
                                guest.user?.image || "https://i.pravatar.cc/48"
                              }
                              alt={guest.user?.first_name || "Guest"}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-colors duration-300"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-300">
                              {guest.user?.first_name} {guest.user?.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Guest #{startIndex + index + 1}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>

                      {/* Guest Details */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 truncate">
                            {guest.user?.email || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-600">
                              {guest.booking_count || 0} Bookings
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="font-semibold text-green-600">
                              ${guest.total_price || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 py-3 bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300">
                      <div className="flex items-center justify-between text-xs text-gray-500 group-hover:text-blue-600">
                        <span>Click to view details</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Active</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-8"
            >
              {/* Table Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-600 uppercase tracking-wide">
                  <div className="col-span-1">#</div>
                  <div className="col-span-3">Guest</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Bookings</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {paginatedBookings.map((guest, index) => (
                  <div
                    key={guest.id || index}
                    onClick={() => handleRowClick(guest)}
                    className="px-6 py-4 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        <span className="text-sm font-medium text-gray-500">
                          {startIndex + index + 1}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={
                                guest.user?.image || "https://i.pravatar.cc/40"
                              }
                              alt={guest.user?.first_name || "Guest"}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-200 transition-colors duration-300"
                            />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
                              {guest.user?.first_name} {guest.user?.last_name}
                            </p>
                            <p className="text-xs text-gray-500">Guest</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate">
                            {guest.user?.email || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {guest.booking_count || 0}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-semibold text-green-600">
                            ${guest.total_price || 0}
                          </span>
                        </div>
                      </div>

                      <div className="col-span-1">
                        <button className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors duration-200 group-hover:scale-110">
                          <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && paginatedBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Guests Found
            </h3>
            <p className="text-gray-600">
              There are no bookings for this service yet.
            </p>
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startIndex + 1}</span>–
              <span className="font-semibold">
                {Math.min(endIndex, totalGuests)}
              </span>{" "}
              of <span className="font-semibold">{totalGuests}</span> guests
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white shadow-lg scale-110"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
