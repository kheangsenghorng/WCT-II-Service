"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation"; // Assuming you're using react-router or similar

const Sidebar = () => {
  const [selectedItem, setSelectedItem] = useState("Saved Services");
  const { id } = useParams(); // Assuming you're using react-router or similar

  const items = [
    "Saved Services",
    "Bookings",
    "Payment Details",
    "Settings",
    "Reviews & Ratings",
    "Saved Address",
  ];

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
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md py-6 px-6 w-full max-w-xs"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="space-y-3">
        {items.map((item) => (
          <motion.div variants={itemVariants} key={item}>
            <Link
              href={`/profile/${id}/${item.toLowerCase().replace(/ /g, "-")}`}
              className={`block py-4 px-4 rounded-2xl font-medium ${
                selectedItem === item
                  ? "bg-green-50 text-green-700 font-semibold shadow"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              } transition-colors duration-200`}
              onClick={() => setSelectedItem(item)}
            >
              {item}
            </Link>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;