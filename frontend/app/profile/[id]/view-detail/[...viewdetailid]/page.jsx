"use client";
import React, { useEffect, useState } from "react";
import { useBookingStoreFetch } from "@/store/bookingStore";
import StaffProvider from "@/components/StaffProvider";

import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  AlertOctagon,
} from "lucide-react";
import { useParams } from "next/navigation";

const ViewDetail = () => {
  // Mock data and state management

  const { id, viewdetailid } = useParams();
  //  console.log(id, viewdetailid);

  const { booking, loading, error, fetchBookingDetail } =
    useBookingStoreFetch();

  // Extract userId and serviceId from URL params
  const userId = id;
  const serviceId = viewdetailid?.[0] || null;
  const bookingId = viewdetailid?.[1] || null;

  //image modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const extraImages =
    booking?.service?.images?.slice(4) && booking.service.images.length > 4
      ? booking.service.images.slice(4)
      : [];

  // Fetch booking details on mount or params change
  useEffect(() => {
    if (userId && serviceId && bookingId) {
      fetchBookingDetail(userId, serviceId, bookingId);
    }
  }, [userId, serviceId, bookingId, fetchBookingDetail]);

  console.log(booking);

  // Define statusConfig
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      badgeColor: "bg-yellow-600 text-white",
    },
    approve: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      badgeColor: "bg-blue-600 text-white",
    },
    complete: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      badgeColor: "bg-blue-600 text-white",
    },
    default: {
      icon: MapPin,
      color: "text-gray-500",
      bgColor: "bg-gray-200",
      badgeColor: "bg-gray-500 text-white",
    },
  };

  // Calculate status icon and color after booking is loaded
  const statusKey = booking?.status?.toLowerCase() || "default";
  const {
    icon: StatusIcon,
    color,
    bgColor,
    badgeColor,
  } = statusConfig[statusKey] || statusConfig.default;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title & Back */}
      <div className="flex items-center space-x-4 mb-4">
        <motion.button
          onClick={handleBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-2 flex items-center justify-center transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {loading ? "Loading..." : booking?.service?.name || "Service Name"}
        </h1>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          Loading booking details...
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side: Image + Info */}
          <div className="col-span-2 flex flex-col">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            >
              <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
                Tour Gallery
              </div>
              <img
                src={booking?.service?.images?.[0] || "default-avatar.png"}
                alt="Tour"
                className="rounded-lg w-full h-[260px] object-cover mb-4"
              />
              <div className="flex flex-wrap gap-2 mb-4 pe-4">
                {booking?.service?.images?.slice(1, 4).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Tour ${index}`}
                    className="rounded-lg w-1/3 aspect-video object-cover flex-shrink-0"
                  />
                ))}
              </div>
              <div className="text-sm text-blue-600 text-center mt-2 cursor-pointer">
                View All Photos ({booking?.service?.images?.length || 0})
              </div>

              {/* +X More Photos overlay */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg max-w-lg w-full">
      <h2 className="text-xl font-bold mb-2">All Photos</h2>
      <div className="grid grid-cols-2 gap-2">
        {extraImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Extra ${index}`}
            className="rounded-lg object-cover w-full h-32"
          />
        ))}
      </div>
      <button
        onClick={() => setIsModalOpen(false)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Close
      </button>
    </div>
  </div>
)}

            </motion.div>
          </div>

          {/* Right Side: Booking Summary (Narrower - about 30% width) */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <motion.div
              className="bg-white dark:bg-gray-800 px-6 pt-3 pb-1 rounded-xl shadow-lg w-full sticky top-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
            >
              <h2 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400 py-3">
                Booking Summary
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Your service package details
              </p>

              <div className="space-y-2">
                {/* Provider */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <User className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Provider:
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {booking?.service?.owner?.company_info?.company_name ||
                        "N/A"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {booking?.service?.owner?.first_name || "N/A"}{" "}
                      {booking?.service?.owner?.last_name || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Status with icon and color */}
                <div className="flex items-center justify-between p-2 rounded-md cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <AlertOctagon className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Status:
                    </span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold ${color} ${bgColor}`}
                  >
                    <StatusIcon size={16} />
                    <span className="capitalize text-sm">
                      {booking?.status || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Create Date */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Created:
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {booking?.service?.created_at
                      ? new Date(booking.service.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>

                {/* Booking Date */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Booking Date:
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {booking?.scheduled_date
                      ? new Date(booking.scheduled_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </span>
                </div>

                {/* Time Booking */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Booking Time:
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {booking?.scheduled_time
                      ? new Date(
                          `1970-01-01T${booking.scheduled_time}`
                        ).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </span>
                </div>

                {/* Location */}
                <div className="p-3 rounded-md bg-indigo-50 dark:bg-indigo-900 font-medium text-sm text-indigo-800 dark:text-indigo-100 shadow-sm">
                  <div className="flex items-start space-x-2">
                    <div className="bg-indigo-100 dark:bg-indigo-800 p-1.5 rounded-full mt-0.5">
                      <MapPin
                        className="text-indigo-600 dark:text-indigo-300"
                        size={16}
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block">Location:</span>
                      <span className="font-semibold text-indigo-900 dark:text-white block mt-1">
                        {booking?.location || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={20} />
                      <span className="font-bold">Total Price:</span>
                    </div>
                    <span className="text-xl font-bold">
                      ${Number(booking?.service?.base_price ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* StaffProvider */}
      <div className="mt-8">
        <StaffProvider />
      </div>
    </motion.div>
  );
};

export default ViewDetail;
