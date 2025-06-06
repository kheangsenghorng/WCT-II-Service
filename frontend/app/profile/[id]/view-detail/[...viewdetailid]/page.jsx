"use client"
import { useEffect, useState } from "react"
import { useBookingStoreFetch } from "@/store/bookingStore"
import StaffProvider from "@/components/StaffProvider"

import { motion } from "framer-motion"
import { Clock, MapPin, ArrowLeft, User, Calendar, CheckCircle, AlertOctagon } from "lucide-react"
import { useParams } from "next/navigation"

const ViewDetail = () => {
  // Mock data and state management

  const { id, viewdetailid } = useParams()
  //  console.log(id, viewdetailid);

  const { booking, loading, error, fetchBookingDetail } = useBookingStoreFetch()

  // Extract userId and serviceId from URL params
  const userId = id
  const serviceId = viewdetailid?.[0] || null
  const bookingId = viewdetailid?.[1] || null

  //image modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Remove the extraImages variable since we're not using it anymore
  // const extraImages = booking?.service?.images?.slice(4) && booking.service.images.length > 4 ? booking.service.images.slice(4) : [];

  // Fetch booking details on mount or params change
  useEffect(() => {
    if (userId && serviceId && bookingId) {
      fetchBookingDetail(userId, serviceId, bookingId)
    }
  }, [userId, serviceId, bookingId, fetchBookingDetail])

  console.log(booking)

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
  }

  // Calculate status icon and color after booking is loaded
  const statusKey = booking?.status?.toLowerCase() || "default"
  const { icon: StatusIcon, color, bgColor, badgeColor } = statusConfig[statusKey] || statusConfig.default

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <motion.div
      className="min-h-screen dark:bg-gray-900 p-6 transition-colors duration-300"
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
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-6 py-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
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
              <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">Tour Gallery</div>

              {/* Image Grid - 4 images layout */}
              <div className="grid grid-cols-2 gap-3 h-auto mb-4">
                {/* Main large image - spans 2 rows */}
                <div className="row-span-2">
                  <img
                    src={booking?.service?.images?.[0] || "/placeholder.svg?height=400&width=400"}
                    alt="Main tour image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Top right image */}
                <div>
                  <img
                    src={booking?.service?.images?.[1] || "/placeholder.svg?height=200&width=200"}
                    alt="Tour image 2"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Bottom right image with view more overlay */}
                <div className="relative">
                  <img
                    src={booking?.service?.images?.[2] || "/placeholder.svg?height=200&width=200"}
                    alt="Tour image 3"
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* View More Overlay - only show if there are more than 3 images */}
                  {booking?.service?.images && booking.service.images.length > 4 && (
                    <motion.div
                      className="absolute inset-0 bg-opacity-60 rounded-lg flex items-center justify-center cursor-pointer group"
                      onClick={() => setIsModalOpen(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-center text-white">
                        <div className="text-2xl font-bold mb-1">+{booking.service.images.length - 3}</div>
                        <div className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">View All </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Enhanced Modal for All Photos */}
              {isModalOpen && (
                <motion.div
                  className="fixed inset-0 bg-white/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        All Photos ({booking?.service?.images?.length || 0})
                      </h2>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400 rotate-45" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {booking?.service?.images?.map((img, index) => (
                          <motion.div
                            key={index}
                            className="aspect-video"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <img
                              src={img || "/placeholder.svg?height=300&width=400"}
                              alt={`Tour photo ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Side: Booking Summary (Narrower - about 30% width) */}
          <div className="lg:w-80 lg:flex-shrink-0 h-auto">
            <motion.div
              className="bg-white dark:bg-gray-800 px-6 pt-3 pb-1 rounded-xl shadow-lg w-full sticky top-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
            >
              <h2 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-400 py-3">Booking Summary</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your service package details</p>

              <div className="space-y-2">
                {/* Provider */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <User className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Provider:</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {booking?.service?.owner?.company_info?.company_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {booking?.service?.owner?.first_name || "N/A"} {booking?.service?.owner?.last_name || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Status with icon and color */}
                <div className="flex items-center justify-between p-2 rounded-md cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <AlertOctagon className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Status:</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full font-semibold ${color} ${bgColor}`}
                  >
                    <StatusIcon size={16} />
                    <span className="capitalize text-sm">{booking?.status || "N/A"}</span>
                  </div>
                </div>

                {/* Create Date */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Created:</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {booking?.service?.created_at
                      ? new Date(booking.service.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>

                {/* Booking Date */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Booking Date:</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {booking?.scheduled_date
                      ? new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>

                {/* Time Booking */}
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 cursor-default transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-indigo-400" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Booking Time:</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {booking?.scheduled_time
                      ? new Date(`1970-01-01T${booking.scheduled_time}`).toLocaleTimeString([], {
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
                      <MapPin className="text-indigo-600 dark:text-indigo-300" size={16} />
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
                <div className="border-t pt-4 mt-6 py-10">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={20} />
                      <span className="font-bold">Total Price:</span>
                    </div>
                    <span className="text-xl font-bold">${Number(booking?.service?.base_price ?? 0).toFixed(2)}</span>
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
  )
}

export default ViewDetail
