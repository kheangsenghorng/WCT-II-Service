"use client";

import {
  Home,
  Users,
  FolderKanban,
  Building2,
  LogOut,
  Tags,
} from "lucide-react";
import { useState, useEffect } from "react"; //Import useEffect
import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname } from "next/navigation"; //Import usePathname
import Link from "next/link";

const Sidebar = () => {
  const { id } = useParams();
  const pathname = usePathname(); // Hook to get the current pathname


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
            {
              href: `/admin/${id}/dashboard`,
              icon: Home,
              label: "Admin Dashboard",
            },
            { href: `/admin/${id}/users`, icon: Users, label: "Users" },
            {
              href: `/admin/${id}/category`,
              icon: FolderKanban,
              label: "Category",
            },
            { href: `/admin/${id}/type`, icon: FolderKanban, label: "Type" },
            { href: `/admin/${id}/company`, icon: Building2, label: "Company" },
            { href: `/admin/${id}/blog`,  icon: Tags , label: "Blog" },
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

        </nav>
      </motion.aside>


    </>
  );
};

export default Sidebar;
