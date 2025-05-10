'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams, usePathname } from 'next/navigation';
import {
  User,
  Bookmark,
  Calendar,
  CreditCard,
  Star,
  MapPin,
  Settings,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();

  const [items, setItems] = useState([
    { name: 'MyProfile', icon: User },
    { name: 'Saved Services', icon: Bookmark },
    { name: 'Bookings', icon: Calendar },
    { name: 'Payment Details', icon: CreditCard },
    { name: 'Reviews & Ratings', icon: Star },
    { name: 'Saved Address', icon: MapPin },
    { name: 'Settings', icon: Settings },
    { name: 'Logout', icon: LogOut },
  ]);

  const [selectedItem, setSelectedItem] = useState('Profile');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split('/') || [];
      const lastPathSegment = pathParts[pathParts.length - 1];
      const formattedSegment = lastPathSegment.replace(/-/g, ' ') || '';

      const matchingItem = items.find(
        (item) => item.name.toLowerCase() === formattedSegment
      );
      if (matchingItem) {
        setSelectedItem(matchingItem.name);
      }
    }
  }, [pathname, items]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2, // Reduced duration for faster transitions
        ease: 'easeInOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    hover: { scale: 1.05 },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: 'easeInOut' }, // Shorter transition duration for the popup
    },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
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
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover="hover"
            >
              {item.name === 'Logout' ? (
                <div
                  onClick={() => setShowLogoutPopup(true)}
                  className={`flex items-center py-4 px-4 rounded-2xl font-medium transition-colors duration-200 cursor-pointer
                    ${isActive
                      ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </div>
              ) : (
                <Link
                  href={`/profile/${id}/${item.name.toLowerCase().replace(/ /g, '-')}`}
                  className={`flex items-center py-4 px-4 rounded-2xl font-medium transition-colors duration-200
                    ${isActive
                      ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold shadow'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  onClick={() => setSelectedItem(item.name)}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Confirmation Popup */}
      {showLogoutPopup && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out opacity-100"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-xs flex flex-col">
            {/* Header with Icon */}
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
              <h3 className="text-lg font-semibold dark:text-gray-100 text-center">
                Confirm Logout
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-between items-center">
              <button
                className="bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 py-2 px-4 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
