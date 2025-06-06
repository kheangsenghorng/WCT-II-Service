"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Mail, MapPin, Phone, Calendar, EditIcon, ZoomIn, X, User, Star } from "lucide-react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { useUserStore } from "@/store/useUserStore"
import { useUserBooking } from "@/store/useUserBooking"

const ProfilePage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { user, fetchUserById, loading, error } = useUserStore()
  const [showImageModal, setShowImageModal] = useState(false)
  const { bookings, fetchBookingsByUserId, loading: bookingsLoading } = useUserBooking()

  useEffect(() => {
    if (id) {
      fetchUserById(id);
      fetchBookingsByUserId(id); // use the new function
    }
  }, [id, fetchUserById, fetchBookingsByUserId]);


  const totalBookings = bookings.filter(booking => booking.userId === id).length



  const handleOpenImageModal = () => setShowImageModal(true)
  const handleCloseImageModal = () => setShowImageModal(false)

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div className="flex flex-col items-center space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">Loading profile...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-200 dark:border-red-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Profile</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">User not found</h3>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Background */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="relative -mt-32 px-4 pb-12">
        <motion.div className="max-w-4xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
          {/* Main Profile Card */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
            variants={cardVariants}
          >
            {/* Profile Header */}
            <div className="relative p-8 pb-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Avatar */}
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenImageModal}
                >
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full p-1">
                        <div className="relative w-full h-full rounded-full overflow-hidden">
                          <Image
                            src={user?.image || "/default-avatar.png"}
                            alt={`${user.first_name} ${user.last_name}'s avatar`}
                            fill
                            className="object-cover"
                            priority
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Online Status Indicator */}
                  {/* <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full shadow-lg" /> */}
                </motion.div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        {user.first_name} {user.last_name}
                      </h1>
                      <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">Premium Member</span>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => router.push(`/profile/${id}/settings`)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <EditIcon className="w-5 h-5" />
                      Edit Profile
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.location || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Statistics */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Activity Overview
                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
  {bookingsLoading ? <span className="animate-pulse">...</span> : totalBookings}
</p>

                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Services booked to date</div>
                  </div>

                  {/* Additional Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
                    </div>
                    <div className="bg-white dark:bg-gray-700/50 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseImageModal}
        >
          <motion.div
            className="relative max-w-lg w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-square bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={user?.image || "/default-avatar.png"}
                alt="Full Size Avatar"
                fill
                className="object-cover"
                priority
              />
            </div>

            <motion.button
              className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200"
              onClick={handleCloseImageModal}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ProfilePage
