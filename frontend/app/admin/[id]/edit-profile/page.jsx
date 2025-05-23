"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Save, AlertTriangle, EditIcon } from "lucide-react";
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
          : "/default-user.svg"
      );
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) setAvatarPreview(reader.result);
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

  return (
    <motion.div
      className="px-6 py-12 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-6">My Profile</h1>

        <div className="flex">
          <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3">
            <Image
              src={avatarPreview}
              alt="Avatar"
              fill
              className="rounded-full object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="m-10">
            <p className="text-lg font-semibold text-black dark:text-white">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter......"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter......"
          />
        </div>
        </div>

      <div className="flex justify-between">
          <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="mt-1 w-full px-4 py-2 border bg-gray-100 rounded-md dark:bg-gray-700 dark:text-white"
            placeholder="Enter......"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter......"
          />
        </div>
      </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <p className="mt-1 text-sm text-gray-500">No bio yet</p>
        </div>
      </div>

      <motion.button
        onClick={handleUpdate}
        className="mt-10 w-[150px] flex items-center justify-center gap-2 px-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
        whileHover={{ scale: 1.03 }}
      >
        <Save className="w-5 h-5" />
        Update
      </motion.button>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full max-w-sm"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm Update</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to save these changes?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
