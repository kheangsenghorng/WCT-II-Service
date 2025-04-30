"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // ✅ Make sure this exists

const Navbar = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.cookie = "user=; Max-Age=0"; // Clear user cookie manually
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const loggedInUserId = getCookie("user");
        if (loggedInUserId) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${loggedInUserId}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(`Error fetching user: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getCookie = (name) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
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

        {/* Links */}
        <div className="hidden md:flex space-x-14 text-xl">
          <Link href="/" className="text-gray-600 hover:text-green-500">Home</Link>
          <Link href={`/user/${id}/about-us`} className="text-gray-600 hover:text-green-500">About us</Link>
          <Link href="/services" className="text-gray-600 hover:text-green-500">Service</Link>
          <Link href="/blog" className="text-gray-600 hover:text-green-500">Blog</Link>
          <Link href={`/user/${id}/contact`} className="text-gray-600 hover:text-green-500">Contact</Link>
        </div>

        {/* Auth Section */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.profileImage || "/default-avatar.png"} alt={user.name || "User"} />
                <AvatarFallback>{(user.name || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-3">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
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
