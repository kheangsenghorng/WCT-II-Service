"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search, HelpCircle, Bell } from "lucide-react"; // Import icons from lucide-react
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

const Navbar = () => {
  const { id } = useParams();
  console.log(id);

  const { fetchUserById, user, error, loading } = useUserStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure this runs only on the client
    setIsClient(true);
    fetchUserById(id);
  }, [fetchUserById]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between transition-colors duration-300">
      {/* Left Side: Logo and Cleaning Services Provider */}
      <div className="flex items-center">
        <Image
          src="/logo.png" // Replace with your logo path
          alt="CleaningPro Logo"
          width={40}
          height={40}
          className="mr-2"
        />
        <div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            Cleaning
            <span className="text-2xl text-green-600 px-1">Pro</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Cleaning Services Provider
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-1/3">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
        </div>
        <input
          type="search"
          placeholder="Search..."
          className="block w-full p-2 pl-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          required
        />
      </div>

      {/* Right Side: Help, Notifications, and User Profile */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
          <HelpCircle className="h-6 w-6" aria-hidden="true" />
        </button>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
          <Bell className="h-6 w-6" aria-hidden="true" />
        </button>
        {isClient && (
          <div className="flex items-center">
            <Image
              src={user?.image || "/default-user.svg"} // Replace with your actual user profile image path
              alt={user?.last_name || "USER"}
              width={30}
              height={30}
              className="rounded-full mr-2"
            />
            <div>
              <h1 className="font-semibold text-sm text-gray-800 dark:text-white">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
