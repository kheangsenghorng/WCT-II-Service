"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  AlertTriangle,
  Edit,
  Camera,
  Phone,
  Mail,
  CheckCircle,
  MapPin,
  Building2,
  Globe,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useCompanyInfoStore } from "@/store/usecompanyInfoStory";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const { user, updateUser, fetchUserById } = useUserStore();
  const { id } = useParams();
  const ownerId = id; // Assuming the ownerId is the same as the user id in this context
  const router = useRouter();
  const userId = user?.id || id; // Fallback to id if user is not available

  // Basic Information
  const [companyName, setCompanyName] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [description, setDescription] = useState("");

  // Contact Information
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Business Details
  const [businessHours, setBusinessHours] = useState("");
  // const [services, setServices] = useState("");
  // Social Media & Online Presence
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Other states
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef(null);
  const { fetchUsersByOwner, count } = useUserStore();
  const {
    companyInfo,
    fetchCompanyInfo,
    saveCompanyInfo,
    updateCompanyInfo,
    loading,
    error,
  } = useCompanyInfoStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
      fetchCompanyInfo(id);
    }
  }, [id, fetchUserById]);

  useEffect(() => {
    if (!user) return;

    // User Info
    setEmail(user.email || "");
    setPhone(user.phone || "");

    setAvatarPreview(
      user.image?.startsWith("http")
        ? user.image
        : user.image
        ? `/${user.image}`
        : "/default-avatar.png"
    );

    // Company Info
    if (companyInfo) {
      // Basic Info
      setCompanyName(companyInfo.company_name ?? "");
      setDescription(companyInfo.description ?? "");

      // Contact Info
      setWebsite(companyInfo.website_url ?? "");
      setAddress(companyInfo.address ?? "");
      setCity(companyInfo.city ?? "");
      setCountry(companyInfo.country ?? "");

      // Business Info
      setBusinessHours(companyInfo.business_hours ?? "");
      // setServices(companyInfo.services ?? ""); // Uncomment if using

      // Socials
      setFacebook(companyInfo.facebook_url ?? "");
      setInstagram(companyInfo.instagram_url ?? "");
      setTwitter(companyInfo.twitter_url ?? "");
      setLinkedin(companyInfo.linkedin_url ?? "");
    } else {
      // Reset all company-related fields if no info
      setCompanyName("");
      setDescription("");
      setWebsite("");
      setAddress("");
      setCity("");
      setCountry("");
      setBusinessHours("");
      setFacebook("");
      setInstagram("");
      setTwitter("");
      setLinkedin("");
    }
  }, [user, companyInfo]); // ✅ Depend on both

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
    setIsLoading(true);

    try {
      // --- 1. Update User Data ---
      const userFormData = new FormData();

      userFormData.append("phone", phone ?? "");
      if (avatarFile) {
        userFormData.append("image", avatarFile);
      }

      await updateUser(user.id, userFormData);

      // --- 2. Save or Update Company Info ---
      const companyFormData = new FormData();

      const safeAppend = (key, value) => {
        companyFormData.append(key, value ?? "");
      };

      // Basic Information
      safeAppend("company_name", companyName);
      safeAppend("description", description);

      // Contact Information
      safeAppend("website_url", website);
      safeAppend("address", address);
      safeAppend("city", city);
      safeAppend("country", country);

      // Business Details
      safeAppend("business_hours", businessHours);
      // safeAppend("services", services); // Uncomment if needed

      // Social Media
      safeAppend("facebook_url", facebook);
      safeAppend("instagram_url", instagram);
      safeAppend("twitter_url", twitter);
      safeAppend("linkedin_url", linkedin);

      await saveCompanyInfo(user.id, companyFormData);

      // --- 3. Refresh Data ---
      await fetchUserById(user.id);
      await fetchCompanyInfo(user.id);

      router.push(`/owner/${user.id}/dashboard`);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
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
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [stats, setStats] = useState([
    {
      id: "user",
      label: "Total User",
      value: 0,
      change: 25,
      isPositive: true,
    },
  ]);

  // Fetch users when ownerId is available
  // Fetch users when ownerId is available
  useEffect(() => {
    if (!ownerId) return;

    const fetch = async () => {
      try {
        const users = await fetchUsersByOwner(ownerId);
        if (Array.isArray(users)) {
          setCount(users.length);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetch();
  }, [ownerId, fetchUsersByOwner]);

  // Update user stat count when `count` changes
  useEffect(() => {
    setStats((prevStats) =>
      prevStats.map((stat) =>
        stat.id === "user" ? { ...stat, value: count } : stat
      )
    );
  }, [count]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        <Card className="shadow-xl border-0 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <CardHeader className="pb-8 pt-10 px-8 border-b border-gray-100 dark:border-gray-700">
            <motion.div
              variants={itemVariants}
              className="flex items-center mb-4"
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg mr-4">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  Company Profile Settings
                </CardTitle>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage your company information and business details
                </p>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Company Logo Section */}
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="relative group">
                <Avatar className="relative w-32 h-32 border-4 border-blue-200 shadow-lg transition-transform duration-300 hover:scale-105">
                  <AvatarImage
                    src={avatarPreview || "/default-avatar.png"}
                    alt="Company Logo"
                    width={128}
                    height={128}
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="text-3xl font-semibold flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {companyName?.[0] || "C"}
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
            <div className="grid gap-8">
              {/* Basic Company Information */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Basic Company Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyName"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-lg h-12"
                    />
                  </div>
                  {/* // === UI for employee count input === */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="employeeCount"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                      Employee Count
                    </Label>
                    <Input
                      id="employeeCount"
                      value={count}
                      placeholder="e.g., 1-5, 6-10, 11-25"
                      className="border-gray-300 dark:border-gray-600 focus:border-indigo-500 transition-colors rounded-lg h-12"
                      disabled
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                  >
                    <Edit className="w-4 h-4 text-purple-600" />
                    Company Description
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your company, mission, and what makes you unique..."
                    rows={4}
                    className="border-gray-300 dark:border-gray-600 focus:border-purple-500 transition-colors rounded-lg"
                  />
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Mail className="w-4 h-4 text-orange-600" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg h-12 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="border-gray-300 dark:border-gray-600 focus:border-green-500 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Globe className="w-4 h-4 text-blue-600" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourcompany.com"
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="businessHours"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Clock className="w-4 h-4 text-purple-600" />
                      Business Hours
                    </Label>
                    <Input
                      id="businessHours"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      placeholder="e.g., Mon-Fri 9AM-6PM"
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 transition-colors rounded-lg h-12"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <MapPin className="w-4 h-4 text-red-600" />
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter street address"
                      className="border-gray-300 dark:border-gray-600 focus:border-red-500 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      className="border-gray-300 dark:border-gray-600 focus:border-red-500 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Enter country"
                      className="border-gray-300 dark:border-gray-600 focus:border-red-500 transition-colors rounded-lg h-12"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Business Details */}
              {/* <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Business Details
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="services"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Award className="w-4 h-4 text-blue-600" />
                      Services Offered
                    </Label>
                    <Textarea
                      id="services"
                      value={services}
                      onChange={(e) => setServices(e.target.value)}
                      placeholder="List your main services and offerings..."
                      rows={3}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-lg"
                    />
                  </div>
                </div>
              </motion.div> */}

              {/* Social Media */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Social Media & Online Presence
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="facebook"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/yourcompany"
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="instagram"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/yourcompany"
                      className="border-gray-300 dark:border-gray-600 focus:border-pink-500 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="twitter"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/yourcompany"
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-400 transition-colors rounded-lg h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-600 transition-colors rounded-lg h-12"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Update Button */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 text-lg font-semibold"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Update Company Profile
                  </div>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Confirm Changes
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Are you sure you want to save these changes to your company
                    profile?
                  </p>

                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirmModal(false)}
                      className="border-gray-300 dark:border-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmUpdate}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Confirm
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
