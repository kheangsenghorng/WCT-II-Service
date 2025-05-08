"use client";

import React, { useState, useEffect } from "react"; // Import useEffect
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import {
  User,
  Bookmark,
  Calendar,
  CreditCard,
  Star,
  MapPin,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();

  // Initialize items state
  const [items, setItems] = useState([
    { name: "MyProfile", icon: User },
    { name: "Saved Services", icon: Bookmark },
    { name: "Bookings", icon: Calendar },
    { name: "Payment Details", icon: CreditCard },
    { name: "Reviews & Ratings", icon: Star },
    { name: "Saved Address", icon: MapPin },
    { name: "Settings", icon: Settings },
  ]);

  const [selectedItem, setSelectedItem] = useState("Profile"); // Default to Profile

  // Use useEffect to derive selectedItem after items is initialized
  useEffect(() => {
    if (pathname) {
      const pathParts = pathname?.split("/") || [];
      const lastPathSegment = pathParts[pathParts.length - 1];
      const formattedSegment = lastPathSegment?.replace(/-/g, " ") || "";

      const matchingItem = items.find(
        (item) => item.name.toLowerCase() === formattedSegment
      );
      if (matchingItem) {
        setSelectedItem(matchingItem.name);
      }
    }
  }, [pathname, items]); // Depend on pathname and items

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { scale: 1.05 },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md py-6 px-6 w-full max-w-xs"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="space-y-3">
        {items.map((item) => {
          const isActive = selectedItem === item.name;
          return (
            <motion.div key={item.name} variants={itemVariants} whileHover="hover">
              <Link
                href={`/profile/${id}/${item.name.toLowerCase().replace(/ /g, "-")}`}
                className={`flex items-center py-4 px-4 rounded-2xl font-medium transition-colors duration-200
                  ${isActive
                    ? "bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                onClick={() => setSelectedItem(item.name)}
              >
                <item.icon className="w-5 h-5 mr-2" />
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;