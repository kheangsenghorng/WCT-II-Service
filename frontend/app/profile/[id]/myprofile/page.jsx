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

const ProfilePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { user, fetchUserById, loading, error } = useUserStore();
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id, fetchUserById]);

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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent shadow-md" />
        <p className="mt-4 text-red-600 font-medium text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!user) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="flex justify-center px-4 md:px-0 py-10 ">
      <motion.div
        className="w-full max-w-4xl dark:bg-gray-800 p-8 md:p-12 flex flex-col md:flex-row gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar Section */}
        <div
          className="relative w-46 h-46 md:w-48 md:h-48 rounded-full overflow-hidden group shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer"
          onClick={handleOpenImageModal}
        >
          <Image
            src={user.image || "/default-user.svg"}
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
        <div className="flex-1 md:ml-6 flex flex-col ">
          <div className="flex items-start justify-between mb-6 flex-col md:flex-row md:items-center">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-2 md:mb-0">
              {user.first_name} {user.last_name}
            </h1>

            <button
              onClick={() => router.push(`/profile/${id}/settings`)}
              className="inline-flex items-center gap-2 text-sm font-medium dark:bg-gray-700 text-gray-800 py-2 px-4 rounded-xl transition duration-200"
              aria-label="Edit Profile"
            >
              <EditIcon className="w-8 h-8" />
            </button>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-8 h-8 text-blue-500" />
              <span className="text-xl">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-blue-500" />
              <span className="text-xl">{user.location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-8 h-8 text-blue-500" />
              <span className="text-xl">{user.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-xl">
                {user.hotelsBooked ?? 0} Hotels Booked
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      {showImageModal && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseImageModal}
        >
          <div
            className="relative w-full max-w-2xl max-h-[80vh] p-4"
            onClick={stopPropagation}
          >
            <Image
              src={user.avatarUrl || "/default-user.svg"}
              alt="Full Size Avatar"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-white bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-800"
              onClick={handleCloseImageModal}
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;
