"use client";

import {
  Home,
  Users,
  FolderKanban,
  Calendar,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  // Load the sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    if (savedState !== null) {
      setIsExpanded(JSON.parse(savedState));
    }
  }, []);

  // Save the sidebar state to localStorage whenever it changes
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("sidebarExpanded", JSON.stringify(newState));
  };

  const sidebarVariants = {
    expanded: {
      width: "256px",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    collapsed: {
      width: "64px",
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

  const chevronVariants = {
    expanded: { rotate: 0 },
    collapsed: { rotate: 180 },
  };

  const navItems = [
    { href: `/owner/${id}/dashboard`, icon: Home, label: "Owner Dashboard" },
    { href: `/owner/${id}/users`, icon: Users, label: "Staff" },
    { href: `/owner/${id}/services`, icon: FolderKanban, label: "Service" },
    { href: `/owner/${id}/booking`, icon: Calendar, label: "Booking" },
  ];

  return (
    <motion.aside
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen py-8 shadow-md flex flex-col relative"
      initial={isExpanded ? "expanded" : "collapsed"}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
    >
      <motion.button
        className="absolute -right-3 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 shadow-md z-10"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <motion.div
          variants={chevronVariants}
          initial={isExpanded ? "expanded" : "collapsed"}
          animate={isExpanded ? "expanded" : "collapsed"}
        >
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </motion.div>
      </motion.button>

      <nav className="space-y-3 flex-1 overflow-hidden">
        <TooltipProvider delayDuration={300}>
          {navItems.map(({ href, icon: Icon, label }, i) => {
            const isActive = pathname === href;

            return (
              <div key={label} className="px-2">
                {isExpanded ? (
                  <Link
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
                      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {label}
                      </span>
                    </motion.div>
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={`group flex items-center justify-center py-3 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-900 dark:hover:text-white transition-colors ${
                          isActive
                            ? "bg-blue-100 dark:bg-gray-600 text-blue-900 dark:text-white"
                            : ""
                        }`}
                      >
                        <motion.div
                          custom={i}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          className="flex items-center justify-center"
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-50">
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-700 my-4 mx-2"></div>

      <TooltipProvider delayDuration={300}>
        <div className="px-2">
          {isExpanded ? (
            <button className="w-full flex items-center py-3 px-4 rounded-md text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors">
              <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-full flex items-center justify-center py-3 px-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="z-50">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </motion.aside>
  );
};

export default Sidebar;
