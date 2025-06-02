"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import {
  User,
  Bookmark,
  Calendar,
  Star,
  MapPin,
  Settings,
  LogOut,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const FancySidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  // Initialize state from localStorage or default to false (collapsed)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Track if component has loaded

  const [items, setItems] = useState([
    { name: "MyProfile", icon: User, color: "from-purple-400 to-pink-400" },
    {
      name: "Saved Services",
      icon: Bookmark,
      color: "from-blue-400 to-cyan-400",
    },
    {
      name: "Service Booked",
      icon: Calendar,
      color: "from-green-400 to-emerald-400",
    },
    {
      name: "Reviews & Ratings",
      icon: Star,
      color: "from-yellow-400 to-orange-400",
    },
    { name: "Saved Address", icon: MapPin, color: "from-red-400 to-pink-400" },
    { name: "Settings", icon: Settings, color: "from-gray-400 to-slate-400" },
    { name: "Logout", icon: LogOut, color: "from-red-500 to-red-600" },
  ]);

  const [selectedItem, setSelectedItem] = useState("Profile");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
    setIsLoaded(true);
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, isLoaded]);

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/") || [];
      const lastPathSegment = pathParts[pathParts.length - 1];
      const formattedSegment = lastPathSegment.replace(/-/g, " ") || "";

      const matchingItem = items.find(
        (item) => item.name.toLowerCase() === formattedSegment
      );
      if (matchingItem) {
        setSelectedItem(matchingItem.name);
      }
    }
  }, [pathname, items]);

  const handleLogout = async () => {
    await logout();
    // Clear sidebar state on logout if desired
    localStorage.removeItem("sidebar-collapsed");
    window.location.href = "/";
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Don't render until we've loaded the state from localStorage
  if (!isLoaded) {
    return (
      <div className="w-20 h-96 bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse" />
    );
  }

  const containerVariants = {
    expanded: {
      width: "20rem",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    collapsed: {
      width: "5.5rem",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, x: -10, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const sparkleVariants = {
    animate: {
      rotate: 360,
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      },
    },
  };

  return (
    <>
      <motion.div
        className="relative overflow-hidden"
        variants={containerVariants}
        animate={isCollapsed ? "collapsed" : "expanded"}
        initial={isCollapsed ? "collapsed" : "expanded"}
      >
        {/* Background with gradient and glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/20 dark:border-gray-700/30" />

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-8 left-4 w-16 h-16 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 py-8 px-4">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between mb-8">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    variants={sparkleVariants}
                    animate="animate"
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={toggleSidebar}
              className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              whileHover={{ rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isCollapsed ? (
                  <Menu className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>
          </div>

          <nav className="space-y-3">
            {items.map((item, index) => {
              const isActive = selectedItem === item.name;
              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                  className="relative group"
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.name === "Logout" ? (
                    <motion.div
                      onClick={() => setShowLogoutPopup(true)}
                      className={`relative flex items-center py-4 px-4 rounded-2xl font-medium text-sm transition-all duration-300 cursor-pointer overflow-hidden group
                        ${isCollapsed ? "justify-center" : ""}
                        ${
                          isActive
                            ? "bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 dark:text-red-400 shadow-lg border border-red-200 dark:border-red-800"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-500/5 hover:to-red-600/5 hover:text-red-600 dark:hover:text-red-400"
                        }`}
                      whileHover={{ x: isCollapsed ? 0 : 5 }}
                    >
                      {/* Animated background on hover */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                      />

                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className={`relative z-10 w-6 h-6 ${
                          !isCollapsed ? "mr-4" : ""
                        }`}
                      >
                        <item.icon className="w-full h-full" />
                      </motion.div>

                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="relative z-10 font-semibold"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <Link
                      href={`/profile/${id}/${item.name
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                      onClick={() => setSelectedItem(item.name)}
                    >
                      <motion.div
                        className={`relative flex items-center py-4 px-4 rounded-2xl font-medium text-sm transition-all duration-300 overflow-hidden group
                          ${isCollapsed ? "justify-center" : ""}
                          ${
                            isActive
                              ? "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300 shadow-lg border border-purple-200 dark:border-purple-800"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-pink-500/5 hover:text-purple-700 dark:hover:text-purple-300"
                          }`}
                        whileHover={{ x: isCollapsed ? 0 : 5 }}
                      >
                        {/* Animated background on hover */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                        />

                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}

                        <motion.div
                          variants={iconVariants}
                          whileHover="hover"
                          className={`relative z-10 w-6 h-6 ${
                            !isCollapsed ? "mr-4" : ""
                          }`}
                        >
                          <item.icon className="w-full h-full" />
                        </motion.div>

                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              variants={textVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="relative z-10 font-semibold"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  )}

                  {/* Enhanced Tooltip for collapsed state */}
                  <AnimatePresence>
                    {isCollapsed && hoveredItem === item.name && (
                      <motion.div
                        variants={tooltipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 z-50"
                      >
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white text-sm rounded-xl py-3 px-4 whitespace-nowrap shadow-2xl border border-gray-700/50">
                          <span className="font-semibold">{item.name}</span>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-4 h-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 rotate-45 border-l border-t border-gray-700/50"></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </nav>

          {/* Persistence indicator (optional) */}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Enhanced Logout Popup */}
      <AnimatePresence>
        {showLogoutPopup && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/60 backdrop-blur-sm"
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-96 max-w-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden"
              variants={popupVariants}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-2xl" />

              {/* Header with Icon */}
              <motion.div
                className="flex items-center mb-6 relative z-10"
                variants={popupVariants}
              >
                <motion.div
                  className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <AlertTriangle className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Confirm Logout
                </h3>
              </motion.div>

              {/* Message */}
              <motion.p
                className="text-gray-600 dark:text-gray-400 mb-8 text-center leading-relaxed relative z-10"
                variants={popupVariants}
              >
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex gap-4 relative z-10"
                variants={popupVariants}
              >
                {/* Cancel Button */}
                <motion.button
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
                  onClick={() => setShowLogoutPopup(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                {/* Logout Button */}
                <motion.button
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-600 hover:to-red-700"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Logout
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FancySidebar;
