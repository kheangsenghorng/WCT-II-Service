"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  Calendar,
  Edit as EditIcon,
  ZoomIn,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useUserBooking } from "@/store/useUserBooking";

const ProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, fetchUserById, loading, error } = useUserStore();
  const [showImageModal, setShowImageModal] = useState(false);
  const {
    bookings,
    fetchBookings,
    loading: bookingsLoading,
  } = useUserBooking();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
      fetchBookings(); // fetch all bookings (or you may want to filter later by userId if needed)
    }
  }, [id, fetchUserById, fetchBookings]);

  const handleOpenImageModal = () => setShowImageModal(true);
  const handleCloseImageModal = () => setShowImageModal(false);
  const stopPropagation = (e) => e.stopPropagation();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  if (loading) {
    return (
      <div className="absolute inset-0 bg-opacity-80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent shadow-md" />
        <p className="mt-4 text-green-600 font-medium text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 bg-opacity-80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
        <p className="mt-4 text-red-600 font-medium text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!user) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="flex justify-center px-4 md:px-0 py-10">
      <motion.div
        className="w-full max-w-4xl bg-white dark:bg-gray-800 p-8 md:p-12 flex flex-col-reverse md:flex-row items-center md:items-start gap-10 rounded-xl shadow-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar Section */}
        <div
          className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden group ring-4 ring-white dark:ring-gray-700 shadow-xl hover:scale-105 transition duration-300 cursor-pointer"
          onClick={handleOpenImageModal}
        >
          <Image
            src={user?.image || "/default-user.svg"}
            alt={`${user.first_name} ${user.last_name}'s avatar`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <motion.div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <ZoomIn className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* User Info */}
        <div className="flex-1 flex flex-col w-full">
          <div className="flex justify-between items-start flex-col md:flex-row md:items-center mb-6">
            <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {user.first_name} {user.last_name}
            </h1>
            <button
              onClick={() => router.push(`/profile/${id}/settings`)}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-xl shadow-md transition duration-300"
              aria-label="Edit Profile"
            >
              <EditIcon className="w-5 h-5" />
              Edit Profile
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-medium break-words">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-medium">
                  {user.location || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-medium">
                  {user.phone || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-medium">
                  {bookingsLoading
                    ? "Loading..."
                    : `${bookings?.length ?? 0} Service Booked`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseImageModal}
        >
          <motion.div
            className="relative w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={user?.image || "/default-user.svg"}
                alt="Full Size Avatar"
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center transition"
              onClick={handleCloseImageModal}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
