"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from 'next/navigation'; // Import useParams

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();  // Get the user ID from the URL, make sure it is in page folder
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${id}`);  // Use user ID to fetch specific user
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) { // Removed ": any"
        setError(`Error fetching user data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);  // Run the effect whenever the user ID changes

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  if (loading) {
    return <div className="text-center">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-center">User not found.</div>;  // Handle case where user data is not available
  }

  return (
    <div className="flex justify-center items-center py-5 px-10">
      <motion.div
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image
            src={userData.avatarUrl}
            alt="User Avatar"
            layout="fill"
            objectFit="cover"
            priority
          />
        </div>

        {/* User Information */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            {userData.name}
          </h1>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>{userData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-400" />
              <span>{userData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>{userData.hotelsBooked} Hotels Booked</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;