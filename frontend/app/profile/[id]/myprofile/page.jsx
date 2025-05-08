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
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const handleOpenImageModal = () => setShowImageModal(true);
  const handleCloseImageModal = () => setShowImageModal(false);

  if (loading) return <div className="text-center py-10">Loading user data...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  if (!user) return <div className="text-center py-10">User not found.</div>;

  return (
    <div className="flex justify-center px-4 md:px-0 py-10">
      <motion.div
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar Section */}
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden group shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer">
          <Image
            src={user.avatarUrl || "/default-user.svg"}
            alt="User Avatar"
            layout="fill"
            objectFit="cover"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
            onClick={handleOpenImageModal}
          >
            <ZoomIn className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-6 flex-col md:flex-row md:items-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2 md:mb-0">
              {user.first_name} {user.last_name}
            </h1>
            {user.role && (
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                {user.role}
              </span>
            )}
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-gray-700 dark:text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span>{user.location || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <span>{user.phone || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>{user.hotelsBooked ?? 0} Hotels Booked</span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => router.push(`/edit-profile/${id}`)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition duration-200 mt-6"
          >
            <EditIcon className="w-5 h-5" /> Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      {showImageModal && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseImageModal}
        >
          <div className="relative w-full max-w-2xl max-h-[80vh] p-4">
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
