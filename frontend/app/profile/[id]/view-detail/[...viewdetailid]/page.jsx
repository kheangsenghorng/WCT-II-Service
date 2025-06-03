"use client";

import {
  Clock,
  MapPin,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  AlertOctagon,
} from "lucide-react";
import StaffProvider from "@/components/StaffProvider";
import { useBookingStoreFetch } from "@/store/bookingStore";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ViewDetail() {
  const { id, viewdetailid } = useParams();
  const router = useRouter();

  // Extract userId and serviceId from URL params
  const userId = id;
  const serviceId = viewdetailid?.[0] || null;
  const bookingId = viewdetailid?.[1] || null;

  const { booking, loading, error, fetchBookingDetail } =
    useBookingStoreFetch();

  // Define statusConfig **before** usage
  const statusConfig = {
    pending: {
      icon: Clock, // Yellow clock for pending
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      badgeColor: "bg-yellow-600 text-white", // New property for badge
    },
    approve: {
      icon: CheckCircle, // Green check for confirmed
      color: "text-green-600",
      bgColor: "bg-green-100",
      badgeColor: "bg-blue-600 text-white", // New property for badge
    },
    default: {
      icon: MapPin, // Gray pin for default/unknown
      color: "text-gray-500",
      bgColor: "bg-gray-200",
      badgeColor: "bg-gray-500 text-white", // New property for badge
    },
  };

  // Fetch booking details on mount or params change
  useEffect(() => {
    if (userId && serviceId && bookingId) {
      fetchBookingDetail(userId, serviceId, bookingId);
    }
  }, [userId, serviceId, bookingId, fetchBookingDetail]);

  // Calculate status icon and color after booking is loaded
  // Use defaults if booking or status is undefined
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

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title & Back */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={() => router.back()}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            </motion.div>
          </div>

          {/* Right Side: Booking Summary */}
          <motion.div
            className="bg-white dark:bg-gray-800 px-6 pt-3 pb-1 rounded-xl shadow-lg w-full max-w-lg mx-auto"
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
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {booking?.user?.name || "N/A"}
                </span>
              </div>

              {/* Status with icon and color */}
              <div className="flex items-center justify-between p-2 rounded-md cursor-default transition-colors duration-200">
                {/* Left Side: Label */}
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="text-indigo-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Status:
                  </span>
                </div>

                {/* Right Side: Status Badge */}
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold ${color} ${bgColor}`}
                >
                  <StatusIcon size={20} />
                  <span className="capitalize">{booking?.status || "N/A"}</span>
                </div>
              </div>

              {/* Create Date */}
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-indigo-400" size={20} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Create Date:
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
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
                <span className="font-semibold text-gray-900 dark:text-gray-100">
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
                    Time Booking:
                  </span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
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

              <div className="flex items-center justify-between p-3 rounded-md bg-indigo-50 dark:bg-indigo-900 font-medium text-sm text-indigo-800 dark:text-indigo-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 dark:bg-indigo-800 p-1.5 rounded-full">
                    <MapPin
                      className="text-indigo-600 dark:text-indigo-300"
                      size={18}
                    />
                  </div>
                  <span>Your Location:</span>
                </div>
                <span className="font-semibold text-right text-indigo-900 dark:text-white">
                  {booking?.location || "N/A"}
                </span>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between p-2 rounded-md font-bold text-lg text-indigo-700 cursor-default">
                <div className="flex items-center space-x-2">
                  <CheckCircle size={22} />
                  <span>Total Price:</span>
                </div>
                <span>
                  ${Number(booking?.service?.base_price ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* StaffProvider */}
      <div className="mt-8">
        <StaffProvider />
      </div>
    </motion.div>
  );
}
