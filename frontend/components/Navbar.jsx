"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "../store/useUserStore"; // ✅ Corrected file name

const Navbar = () => {
  const { id } = useParams();
  const router = useRouter();

  const { user, fetchUserById, loading, error, clearUsers } = useUserStore(); // ✅ Corrected the method name and change clearUsers to clearUser

  useEffect(() => {
    if (id) { //  Only fetch user if 'id' exists
      fetchUserById(id); // Store handles fetching based on the cookie/user ID
    }
  }, [id, fetchUserById]);

  const handleLogout = async () => {
    try {
      //  Supabase sign out logic here (ensure supabase is defined)
      document.cookie = "user=; Max-Age=0"; // clear cookie manually
      clearUsers();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="mr-2" />
          <div>
            <p className="text-2xl font-bold text-gray-800">
              Cleaning<span className="text-2xl text-green-600 px-1">Pro</span>
            </p>
            <p className="text-xs text-gray-500">Cleaning Services Provider</p>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-14 text-xl">
          <Link href="/" className="text-gray-600 hover:text-green-500">Home</Link>
          <Link href={`/user/${id}/about-us`} className="text-gray-600 hover:text-green-500">About us</Link>
          <Link href="/services" className="text-gray-600 hover:text-green-500">Service</Link>
          <Link href="/blog" className="text-gray-600 hover:text-green-500">Blog</Link>
          <Link href={`/user/${id}/contact`} className="text-gray-600 hover:text-green-500">Contact</Link>
        </div>

          {/* User Avatar / Login */}
          {loading ? (
  <div>Loading...</div>
) : error ? (
  <div className="text-red-500">{error}</div>
) : user ? (
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar className="cursor-pointer w-15">
      <AvatarImage src={user.profileImage || "/default-user.svg"} alt={user.name || "User"} />
      <AvatarFallback> {`${user.first_name || ""}${user.last_name || ""}`.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56 mr-3">
    <DropdownMenuLabel>{user.first_name || "User"}</DropdownMenuLabel>
    <DropdownMenuLabel>{user.last_name || "User"}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <Link href={`/profile/${user.id}/myprofile`} passHref>
      <DropdownMenuItem asChild>
        <p className="w-full">Profile</p>
      </DropdownMenuItem>
    </Link>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

) : (
  <Link
    href="/login"
    className="bg-green-500 text-white text-xl py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
  >
    Log in
  </Link>
)}

      </div>
    </nav>
  );
};

export default Navbar;