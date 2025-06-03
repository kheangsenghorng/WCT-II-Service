"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBookingStoreFetch } from "@/store/bookingStore";
import { useStaffAssignmentStore } from "@/store/useStaffAssignmentStore";
import {
  Grid3X3,
  List,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Check,
  X,
  AlertCircle,
  Hourglass,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function UserTourHistory({ userId, bookingId }) {
  const { id, serviesId } = useParams();
  const [viewMode, setViewMode] = useState("table"); // "cards" or "table"
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    booking: null,
  });

  const {
    bookings,
    loading,
    error,
    fetchBookingsByUserAndService,
    updateBookingStatus,
  } = useBookingStoreFetch();

  const {
    staffByBooking,
    fetchStaffByBooking,
    unassignStaff,
    loading: staffLoading,
  } = useStaffAssignmentStore();

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userId && serviesId) {
        try {
          await fetchBookingsByUserAndService(userId, serviesId);
        } catch (error) {
          if (error.response?.status === 401) {
            toast.error("Authentication required. Please log in again.");
          } else {
            toast.error("Failed to load bookings");
          }
          console.error("Fetch error:", error);
        }
      }
    };

    fetchData();
  }, [userId, serviesId, fetchBookingsByUserAndService]);

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      hoverColor: "hover:bg-amber-50",
      icon: Hourglass,
      iconColor: "text-amber-500",
      description: "Waiting for approval",
    },
    {
      value: "approved",
      label: "Approved",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      hoverColor: "hover:bg-emerald-50",
      icon: Check,
      iconColor: "text-emerald-500",
      description: "Ready to proceed",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      hoverColor: "hover:bg-blue-50",
      icon: Check,
      iconColor: "text-blue-500",
      description: "Service finished",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-700 border-red-200",
      hoverColor: "hover:bg-red-50",
      icon: X,
      iconColor: "text-red-500",
      description: "Booking cancelled",
    },
  ];

  const getStatusConfig = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status.toLowerCase()
    );
    return (
      statusOption || {
        color: "bg-gray-100 text-gray-700 border-gray-200",
        hoverColor: "hover:bg-gray-50",
        icon: AlertCircle,
        iconColor: "text-gray-500",
        description: "Unknown status",
      }
    );
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    console.log("Attempting to change status:", { bookingId, newStatus });

    try {
      // Show loading state
      toast.loading("Updating status...", { id: "status-update" });

      await updateBookingStatus(bookingId, newStatus);

      // Success feedback
      toast.success(`Status updated to ${newStatus}`, { id: "status-update" });
      setStatusModal({ isOpen: false, booking: null });

      // Refresh the bookings to get updated data
      if (userId && serviesId) {
        await fetchBookingsByUserAndService(userId, serviesId);
      }
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(
        `Failed to update status: ${
          error.response?.data?.message || error.message
        }`,
        { id: "status-update" }
      );
    }
  };

  const openStatusModal = (booking) => {
    setStatusModal({ isOpen: true, booking });
  };

  const closeStatusModal = () => {
    setStatusModal({ isOpen: false, booking: null });
  };

  const handleCardClick = (booking) => {
    window.location.href = `/owner/${id}/booking/${booking?.service?.id}/${userId}/${booking?.id}`;
  };

  const totalPrice = Array.isArray(bookings)
    ? bookings.reduce((acc, item) => {
        const basePrice = Number.parseFloat(item?.service?.base_price || "0");
        return acc + basePrice;
      }, 0)
    : 0;

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

  const StatusButton = ({ booking }) => {
    const statusConfig = getStatusConfig(booking?.status || "pending");
    const IconComponent = statusConfig.icon;

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          openStatusModal(booking);
        }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 border shadow-sm hover:shadow-md transform hover:scale-105 ${statusConfig.color}`}
      >
        <IconComponent className={`w-3 h-3 ${statusConfig.iconColor}`} />
        <span className="capitalize">{booking?.status || "pending"}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
    );
  };

  // Status Change Modal
  const StatusModal = () => {
    if (!statusModal.isOpen || !statusModal.booking) return null;

    const currentStatus = statusModal.booking?.status || "pending";

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Status Options */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Update Status</h3>
              <button
                onClick={closeStatusModal}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {statusOptions.map((option, index) => {
                const OptionIcon = option.icon;
                const isCurrent = currentStatus.toLowerCase() === option.value;

                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={async () => {
                      console.log(
                        "Clicking status:",
                        option.value,
                        "for booking:",
                        statusModal.booking.id
                      );
                      try {
                        await handleStatusChange(
                          statusModal.booking.id,
                          option.value
                        );
                      } catch (error) {
                        console.error("Status change error:", error);
                        toast.error(
                          `Failed to update status: ${error.message}`
                        );
                      }
                    }}
                    disabled={isCurrent}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                      isCurrent
                        ? "border-blue-300 bg-blue-50 cursor-not-allowed opacity-75"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md transform hover:scale-105 cursor-pointer"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${option.color}`}>
                      <OptionIcon className={`w-5 h-5 ${option.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">
                          {option.label}
                        </span>
                        {isCurrent && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                    {!isCurrent && (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="text-red-500 text-center py-8">Error: {error}</div>
      </div>
    );
  }

  if (!bookings) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="text-gray-500 text-center py-8">No booking found.</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            User Service History
          </h2>
          <p className="text-gray-600">Track and manage all service bookings</p>
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

          {/* Total Price */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl shadow-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Total: ${totalPrice}</span>
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.isArray(bookings) && bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id || index}
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleCardClick(booking)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
                  >
                    {/* Card Image */}
                    <div className="relative h-48 bg-gray-100">
                      {booking?.service?.images?.[0] ? (
                        <img
                          src={booking.service.images[0] || "/placeholder.svg"}
                          alt={booking?.service?.name || "Service"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                        <span className="text-xs font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {booking?.service?.name || "Unnamed Service"}
                      </h3>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate" title={booking?.location}>
                            {booking?.location || "No location"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{booking?.scheduled_date || "No date"}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {booking?.scheduled_time
                              ? new Date(
                                  `1970-01-01T${booking.scheduled_time}`
                                ).toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "No time"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="font-semibold text-green-600">
                              $
                              {Number.parseFloat(
                                booking?.service?.base_price || "0"
                              )}
                            </span>
                          </div>

                          {/* Status Button */}
                          <StatusButton booking={booking} />
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Click to view details
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Bookings Found
                  </h3>
                  <p className="text-gray-600">
                    This user hasn't made any bookings yet.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-green-600">
                      Service
                    </th>
                    <th className="px-4 py-3 font-semibold text-green-600 w-48">
                      Location
                    </th>
                    <th className="px-4 py-3 font-semibold text-green-600">
                      Booked Date
                    </th>
                    <th className="px-4 py-3 font-semibold text-green-600">
                      Scheduled Time
                    </th>
                    <th className="px-4 py-3 font-semibold text-green-600">
                      Status
                    </th>
                    <th className="px-4 py-3 font-semibold text-green-600">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(bookings) && bookings.length > 0 ? (
                    bookings.map((booking, index) => (
                      <tr
                        key={index}
                        onClick={() => handleCardClick(booking)}
                        className="bg-white border-b hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                booking?.service?.images?.[0] ||
                                "/placeholder.svg"
                              }
                              alt={booking?.service?.name || "Service Image"}
                              className="w-12 h-12 rounded-md object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div>
                              <p className="text-sm text-gray-500">
                                #{index + 1}
                              </p>
                              <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                                {booking?.service?.name || "Unnamed Service"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-4 py-3 max-w-[12rem] truncate"
                          title={booking?.location}
                        >
                          {booking?.location}
                        </td>
                        <td className="px-4 py-3">{booking?.scheduled_date}</td>
                        <td className="px-4 py-3">
                          {booking?.scheduled_time
                            ? new Date(
                                `1970-01-01T${booking.scheduled_time}`
                              ).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          {/* Status Button for Table */}
                          <StatusButton booking={booking} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="font-semibold text-green-600">
                              $
                              {Number.parseFloat(
                                booking?.service?.base_price || "0"
                              )}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <Calendar className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-lg font-medium mb-2">
                            No bookings found
                          </p>
                          <p className="text-sm">
                            This user hasn't made any bookings yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Change Modal */}
      <StatusModal />

      {/* Staff Modal (keeping existing functionality) */}
      {showStaffModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowStaffModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Staff Details
            </h2>

            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-green-500">Name</th>
                  <th className="px-4 py-3 text-green-500">Profile</th>
                  <th className="px-4 py-3 text-green-500">From (Company)</th>
                  <th className="px-4 py-3 text-green-500">Contact</th>
                  <th className="px-4 py-3 text-green-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedStaff.map((staff, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-bold text-gray-900">
                      {staff.name}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={staff.profile || "/images/default-profile.jpg"}
                        alt={staff.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{staff.company}</td>
                    <td className="px-4 py-3 text-gray-600">{staff.contact}</td>
                    <td className="px-4 py-3">
                      <button className="text-red-600 hover:underline font-semibold">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
