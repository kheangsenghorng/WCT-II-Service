"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "../store/useUserStore";

const Navbar = ({ id }) => {
  const router = useRouter();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(Math.random().toString());
  }, []);

  const { user, fetchUserById, loading, error, clearUser } = useUserStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={0} // or omit width & height
            height={0}
            style={{ width: "35px", height: "auto" }}
          />

          <div>
            <p className="text-xl font-bold text-gray-800">
              Services<span className="text-green-600 px-2">Me</span>
            </p>
            <p className="text-xs text-gray-500">Services Provider</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-14 text-xl">
          <Link
            href={ id ? `/user/${id}/home` : `/` }
            className="text-gray-600 hover:text-green-500"
          >
            Home
          </Link>
          <Link
            href={ id ? `/user/${id}/about-us`
          : `/about-us/`}
            className="text-gray-600 hover:text-green-500"
          >
            About us
          </Link>
          <Link href={ id ? `/user/${id}/service` : `/service`} className="text-gray-600 hover:text-green-500">
            Service
          </Link>
          <Link href={ id ? `/user/${id}/blog` : `/blog`} className="text-gray-600 hover:text-green-500">
            Blog
          </Link>
          <Link
            href={ id
              ? `/user/${id}/contact/`
              : `/contact/`}
            className="text-gray-600 hover:text-green-500"
          >
            Contact
          </Link>
        </div>

        {/* Right Side: User Avatar or Login */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : user ? (
            <Link
            href={`/profile/${user.id}/myprofile`}
            className="flex items-center gap-3 p-2 rounded-lg  dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
          >
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-slate-700 shadow-sm">
              <AvatarImage
                src={user?.image || "/default-avatar.png"}
                alt={`${user.first_name} ${user.last_name}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          
            <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-white">
              {user.first_name} {user.last_name}
            </span>
          </Link>
          
          ) : (
            <Link
              href="/login"
              className="bg-green-500 text-white text-xl py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
