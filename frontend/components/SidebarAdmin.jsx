"use client";

import {
  Home,
  Users,
  FolderKanban,
  Building2,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react"; //Import useEffect
import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname } from "next/navigation"; //Import usePathname
import Link from "next/link";

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname(); // Hook to get the current pathname
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const sidebarVariants = {
    hidden: { x: -250 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" },
    }),
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Redirect or handle sign out
    window.location.href = "/";
  };

  return (
    <>
      <motion.aside
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 h-screen py-8 px-4 shadow-md flex flex-col"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
       
        <nav className="space-y-3 flex-1">
          {[
            { href: `/admin/${id}/dashboard`, icon: Home, label: "Dashboard" },
            { href: `/admin/${id}/users`, icon: Users, label: "Users" },
            { href: `/admin/${id}/category`, icon: FolderKanban, label: "Category" },
            { href: `/admin/${id}/company`, icon: Building2, label: "Company" },
          ].map(({ href, icon: Icon, label }, i) => {
            const isActive = pathname === href; // Check if the current path matches the link's href

            return (
              <Link
                key={label}
                href={href}
                className={`group flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-900 dark:hover:text-white transition-colors ${
                  isActive
                    ? "bg-blue-100 dark:bg-gray-600 text-blue-900 dark:text-white font-semibold"
                    : ""
                }`}
              >
                <motion.div
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="text-sm font-medium">{label}</span>
                </motion.div>
              </Link>
            );
          })}

          {/* Spacer */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className="group flex items-center py-3 px-4 rounded-md w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-800 dark:text-red-400 hover:text-red-700 dark:hover:text-red-200 transition-colors"
            custom={4}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </nav>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Confirm Logout</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;