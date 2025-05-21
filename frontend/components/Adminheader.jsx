"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, HelpCircle, Bell, ChevronDown, LogOut } from "lucide-react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { AnimatePresence, motion } from "framer-motion";
import NotificationsPanel from "./NotificationsPanel";
import { useNotificationStore } from "@/store/notificationStore";

const Navbar = () => {
  const { id } = useParams();
  const { notifications, fetchMyNotifications } = useNotificationStore();
  const { fetchUserById, user } = useUserStore();

  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => setShowNotifications((prev) => !prev);

  const notificationCount =
    notifications?.filter((n) => n.is_read === 0).length || 0;

  const dropdownRef = useRef();

  useEffect(() => {
    setIsClient(true);
    fetchUserById(id);
  }, [fetchUserById, id]);

  useEffect(() => {
    if (id) fetchMyNotifications(id);
  }, [id, fetchMyNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between transition-colors duration-300">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Image src="/logo.png" alt="CleaningPro Logo" width={40} height={40} className="mr-2" />
          <div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              Cleaning<span className="text-2xl text-green-600 px-1">Pro</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cleaning Services Provider</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="block w-full p-2 pl-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            required
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
            <HelpCircle className="h-6 w-6" />
          </button>
          <button
            onClick={toggleNotifications}
            className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 focus:outline-none cursor-pointer"
          >
            <Bell className="h-6 w-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {notificationCount}
              </span>
            )}
          </button>

          {isClient && (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Image
                  src={user?.image || "/default-user.svg"}
                  alt={user?.last_name || "USER"}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="text-left">
                  <h1 className="font-semibold text-sm text-gray-800 dark:text-white">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-[350px] h-[300px] origin-top-right rounded-md bg-gray-100 shadow-sm border ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-3 flex justify-between items-center">
                   <a href="">
                    <div className="flex  justify-between">
                     <img
                      src="/Hero.png"
                      alt="profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="text-left ms-3">
                      <h1 className="font-semibold text-sm text-gray-800 dark:text-white">
                        {user?.first_name} {user?.last_name}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                   </div>
                   </a>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 bg-gray-100 rounded-full w-[30px] h-[30px] hover:bg-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="border-t border-gray-200" />
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-200">Customize Services</a>
                    </li>
                    <div className="border-t border-gray-200" />
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-200">Settings</a>
                    </li>
                  </ul>
                  <div className="border-t border-gray-200" />
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-200">Help & FAQ</a>
                    </li>
                    <div className="border-t border-gray-200" />
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-200">Terms & Policies</a>
                    </li>
                  </ul>
                  <div className="border-t border-gray-200" />
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-white">
                      <LogOut className="mr-2 inline-block h-4 w-4" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Notifications Panel + Overlay */}
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              className="fixed inset-0 bg-opacity-30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleNotifications}
            />
            <NotificationsPanel id={id} onClose={toggleNotifications} />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
