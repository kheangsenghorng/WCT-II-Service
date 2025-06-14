"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Tag,
  Trash2,
  Search,
  Grid3X3,
  List,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  X,
} from "lucide-react";
import { useUserBooking } from "@/store/useUserBooking";
import { useParams, useRouter } from "next/navigation";

export default function AllBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = params?.id;

  const {
    bookings,
    loading,
    error,
    fetchBookingsByOwnerId,
    cancelBooking,
    stats,
  } = useUserBooking();

  // Modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // View and filter states
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (ownerId) {
      fetchBookingsByOwnerId(ownerId);
    }
  }, [ownerId, fetchBookingsByOwnerId]);

  const handleConfirmCancel = (e, id) => {
    e.stopPropagation();
    setSelectedBookingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedBookingId) {
      cancelBooking(selectedBookingId);
      setShowConfirm(false);
      setSelectedBookingId(null);
    }
  };

  const handleRowClick = (booking) => {
    if (booking.service?.id) {
      router.push(`/owner/${ownerId}/booking/${booking.service.id}`);
    }
  };

  const getCategoryColor = (name) => {
    if (!name)
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    ];
    const index = Math.abs(name.charCodeAt(0) % colors.length);
    return colors[index];
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => {
      // Search filter
      const searchMatch = searchQuery
        ? booking.service?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.user?.first_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.user?.last_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      // Status filter
      const statusMatch = statusFilter ? booking.status === statusFilter : true;

      // Category filter
      const categoryMatch = categoryFilter
        ? booking.service?.category?.name === categoryFilter
        : true;

      // Type filter
      const typeMatch = typeFilter
        ? booking.service?.type?.name === typeFilter
        : true;

      // Date filter
      let dateMatch = true;
      if (dateFilter.from || dateFilter.to) {
        const bookingDate = new Date(booking.scheduled_date).getTime();
        const fromDate = dateFilter.from
          ? new Date(dateFilter.from).getTime()
          : 0;
        const toDate = dateFilter.to
          ? new Date(dateFilter.to).getTime()
          : Number.POSITIVE_INFINITY;
        dateMatch = bookingDate >= fromDate && bookingDate <= toDate;
      }

      // Price filter
      let priceMatch = true;
      if (priceRange.min || priceRange.max) {
        const price = Number.parseFloat(booking.service?.base_price || 0);
        const minPrice = priceRange.min ? Number.parseFloat(priceRange.min) : 0;
        const maxPrice = priceRange.max
          ? Number.parseFloat(priceRange.max)
          : Number.POSITIVE_INFINITY;
        priceMatch = price >= minPrice && price <= maxPrice;
      }

      return (
        searchMatch &&
        statusMatch &&
        categoryMatch &&
        typeMatch &&
        dateMatch &&
        priceMatch
      );
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.scheduled_date).getTime();
          bValue = new Date(b.scheduled_date).getTime();
          break;
        case "price":
          aValue = Number.parseFloat(a.service?.base_price || 0);
          bValue = Number.parseFloat(b.service?.base_price || 0);
          break;
        case "name":
          aValue = a.service?.name?.toLowerCase() || "";
          bValue = b.service?.name?.toLowerCase() || "";
          break;
        case "status":
          aValue = a.status?.toLowerCase() || "";
          bValue = b.status?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get unique values for filter dropdowns
  const availableStatuses = [...new Set(bookings.map((b) => b.status))].filter(
    Boolean
  );
  const availableCategories = [
    ...new Set(bookings.map((b) => b.service?.category?.name)),
  ].filter(Boolean);
  const availableTypes = [
    ...new Set(bookings.map((b) => b.service?.type?.name)),
  ].filter(Boolean);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setCategoryFilter("");
    setTypeFilter("");
    setDateFilter({ from: "", to: "" });
    setPriceRange({ min: "", max: "" });
  };

  // Check if any filter is active
  const isFilterActive =
    searchQuery ||
    statusFilter ||
    categoryFilter ||
    typeFilter ||
    dateFilter.from ||
    dateFilter.to ||
    priceRange.min ||
    priceRange.max;

  // Calculate stats
  const bookingStats = {
    total: bookings.length,
    filtered: filteredBookings.length,
    confirmed: bookings.filter(
      (b) => b.status === "confirmed" || b.status === "approved"
    ).length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings.reduce(
      (sum, b) => sum + Number.parseFloat(b.service_total_price || 0),
      0
    ),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    hover: {
      y: -5,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Loading bookings...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
            <h3 className="font-semibold mb-2">Error Loading Bookings</h3>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Bookings Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track all customer bookings efficiently
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookingStats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div> */}

            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{bookingStats.confirmed}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div> */}
            {/* 
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{bookingStats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div> */}

            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{bookingStats.cancelled}</p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div> */}

            {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    ${bookingStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div> */}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by service name, customer name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              {/* <div className="w-full lg:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div> */}

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="w-full lg:w-48">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date-desc">Date (Newest)</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="status-asc">Status (A-Z)</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 ${
                    viewMode === "table"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  } transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-2 ${
                    viewMode === "cards"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  } transition-colors`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {isFilterActive && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Additional Filters Row */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, from: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) =>
                    setDateFilter({ ...dateFilter, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {[
                        "ID",
                        "Service",
                        "Price",
                        "Scheduled",
                        "Category",
                        "Type",
                        "Total",
                        "Guests",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        onClick={() => handleRowClick(booking)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                        whileHover={{
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full">
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                              {index + 1}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                booking.service?.images?.[0] ||
                                "/placeholder.svg?height=40&width=40"
                              }
                              alt={booking.service?.name || "Service"}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600 mr-3"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.service?.name || "Unknown Service"}
                              </div>
                              {/* <div className="text-sm text-gray-500 dark:text-gray-400">ID: {booking.service?.id}</div> */}
                            </div>
                          </div>
                        </td>

                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.user?.first_name} {booking.user?.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{booking.user?.email}</div>
                        </td> */}

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            ${booking.service?.base_price || "0"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                            {formatDate(booking.scheduled_date)}
                          </div>
                        </td>

                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status,
                            )}`}
                          >
                            {booking.status || "pending"}
                          </span>
                        </td> */}

                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.service?.category ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                booking.service.category.name
                              )}`}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {booking.service.category.name}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {booking.service?.type ? (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                booking.service.type.name
                              )}`}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {booking.service.type.name}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            $
                            {Number(
                              booking.service_total_price || 0
                            ).toLocaleString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Users className="h-4 w-4 text-purple-500 mr-1" />
                            {booking.service_booking_count || "0"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(booking);
                              }}
                              className="group/view p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md"
                            >
                              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/view:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={(e) =>
                                handleConfirmCancel(e, booking.id)
                              }
                              className="group/delete p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all duration-200 hover:shadow-md"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover/delete:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {isFilterActive
                    ? "Try adjusting your filters"
                    : "No bookings have been made yet"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Card View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  variants={cardVariants}
                  whileHover="hover"
                  onClick={() => handleRowClick(booking)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        booking.service?.images?.[0] || "/default-clean.webp"
                      }
                      alt={booking.service?.name || "Service"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status || "pending"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {booking.service?.name || "Unknown Service"}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.user?.first_name} {booking.user?.last_name}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Date</span>
                        </div>
                        <span className="text-gray-900 dark:text-white">
                          {formatDate(booking.scheduled_date)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>Price</span>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ${booking.service?.base_price || "0"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Guests</span>
                        </div>
                        <span className="text-gray-900 dark:text-white">
                          {booking.service_booking_count || "0"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        {booking.service?.category && (
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              booking.service.category.name
                            )}`}
                          >
                            {booking.service.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(booking);
                          }}
                          className="group/view p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 transition-all duration-200 hover:shadow-md"
                        >
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/view:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={(e) => handleConfirmCancel(e, booking.id)}
                          className="group/delete p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-all duration-200 hover:shadow-md"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 group-hover/delete:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {isFilterActive
                    ? "Try adjusting your filters"
                    : "No bookings have been made yet"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredBookings.length} of {bookings.length} bookings
          {isFilterActive && " (filtered)"}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cancel Booking
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to cancel this booking? This action
                  cannot be undone and may affect the customer's plans.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
