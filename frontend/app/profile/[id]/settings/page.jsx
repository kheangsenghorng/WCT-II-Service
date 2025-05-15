"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Save, User, Phone, Mail, AlertTriangle, EditIcon } from "lucide-react"; // Import icons
import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion

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
      setPhone(user?.phone || "000000");
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto px-6 py-12 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-start items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">Edit Profile</h1>
      </div>

      <div className="flex justify-center mb-10">
        <motion.div
          className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg group cursor-pointer"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={avatarPreview}
            alt="Avatar"
            fill
            style={{ objectFit: "cover" }}
            className="object-cover rounded-full"
          />

<button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-15  bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            aria-label="Change Avatar"
          >
            <EditIcon className="w-5 h-5" />
          </button>
       
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />



        </motion.div>

       
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* First Name and Last Name */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <User className="h-5 w-5"/>
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mt-2 px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Enter your first name"
            />
          </div>

          <div className="w-1/2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
             <User className="h-5 w-5"/>
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full mt-2 px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <Phone className="h-5 w-5"/>
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-2 px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Email */}
        <div>
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
           <Mail className="w-5 h-5"/>
            Email
          </label>
          <input
            type="text"
            value={user?.email || "User"}
            disabled
            className="w-full mt-2 px-4 py-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 bg-gray-100"
          />
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleUpdate}
        className="mt-8 w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md  transition"
        whileHover={{ scale: 1.05 }}
      >
        <Save className="w-5 h-5" />
        Update
      </motion.button>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-xl w-full max-w-sm">
              <div className="flex items-center mb-6">
                            <AlertTriangle className="h-6 w-6 mr-3 text-red-500" />
                            <h3 className="text-xl font-semibold dark:text-gray-100 text-center text-gray-800"></h3>
                            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Confirm Update</h2>
              </div>
             
              <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to save these changes?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}