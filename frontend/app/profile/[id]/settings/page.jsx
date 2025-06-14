"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Camera,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { user, updateUser, fetchUserById } = useUserStore();
  const { id } = useParams();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/default-user.svg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhone(user?.phone || "");
      setAvatarPreview(
        user.image?.startsWith("http")
          ? user.image
          : user.image
          ? `/${user.image}`
          : "/default-avatar.png"
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const hasFormChanges =
        firstName !== (user.first_name || "") ||
        lastName !== (user.last_name || "") ||
        phone !== (user.phone || "") ||
        avatarFile !== null;
      setHasChanges(hasFormChanges);
    }
  }, [firstName, lastName, phone, avatarFile, user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatarPreview(reader.result);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleUpdate = () => {
    setShowConfirmModal(true);
  };

  const confirmUpdate = async () => {
    if (!user) return;

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone", phone);
    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    try {
      await updateUser(user.id, formData);
      await fetchUserById(user.id);
      router.push(`/profile/${user.id}/myprofile`);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="flex items-center gap-4 text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-blue-100 mt-1">
                Update your personal information
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative -mt-4 px-4 pb-12">
        <motion.div
          className="max-w-2xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Settings Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            {/* Avatar Section */}
            <div className="p-8 pb-6 text-center">
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full p-1">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          fill
                          className="object-cover"
                          priority
                        />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </motion.button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </motion.div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Click the camera icon to change your profile picture
              </p>
            </div>

            {/* Form Section */}
            <div className="px-8 pb-8">
              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        First Name
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your first name"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        Last Name
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      Phone Number
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </motion.div>

                {/* Email Field (Disabled) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Email Address
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        Read-only
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Email address cannot be changed from this page
                  </p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={handleUpdate}
                  disabled={!hasChanges}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    hasChanges
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={hasChanges ? { scale: 1.02 } : {}}
                  whileTap={hasChanges ? { scale: 0.98 } : {}}
                >
                  <Save className="w-5 h-5" />
                  {hasChanges ? "Save Changes" : "No Changes"}
                </motion.button>
              </motion.div>

              {hasChanges && (
                <motion.div
                  className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    You have unsaved changes
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Confirm Changes</h3>
                    <p className="text-blue-100 text-sm">Review your updates</p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to save these changes to your profile?
                </p>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={confirmUpdate}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
