"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Save, AlertTriangle, Edit as EditIcon , Camera, User, Phone, Mail } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import {  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const { user, updateUser, fetchUserById } = useUserStore();
  const { id } = useParams();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState(""); // Added Bio State
  const [avatarPreview, setAvatarPreview] = useState("/default-user.svg");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
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
      setBio(user?.bio || ""); // Load Bio From User Data
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "first_name") setFirstName(value);
    if (name === "last_name") setLastName(value);
    if (name === "phone") setPhone(value);
    if (name === "bio") setBio(value);
  };

  const confirmUpdate = async () => {
    if (!admin) return;

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("phone", phone);
    formData.append("bio", bio);

    if (avatarFile) {
      formData.append("image", avatarFile);
    }

    try {
      await updateUser(user.id, formData);
      await fetchUserById(user.id);
      router.push(`/admin/${id}/dashboard`);
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
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 flex items-center justify-center">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Profile Settings
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Update your personal information and preferences
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-white dark:border-slate-700 shadow-xl">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {firstName?.[0]}
                    {lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-4 h-4" />
                </motion.button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </motion.div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <User className="w-4 h-4" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="first_name"
                    value={firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className="border-slate-200 dark:border-slate-600 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <User className="w-4 h-4" />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="last_name"
                    value={lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className="border-slate-200 dark:border-slate-600 focus:border-blue-500 transition-colors"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="border-slate-200 dark:border-slate-600 focus:border-blue-500 transition-colors"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                />
              </motion.div>
            </div>

            {/* Update Button */}
            <motion.div variants={itemVariants} className="flex justify-end pt-4">
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Changes</h3>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Are you sure you want to save these changes to your profile?
                  </p>

                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmModal(false)}
                      className="border-slate-200 dark:border-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button onClick={confirmUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Confirm
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

