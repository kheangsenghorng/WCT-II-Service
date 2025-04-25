"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png" // Replace with your logo path
              alt="CleaningPro Logo"
              width={40}
              height={40}
              className="mr-2"
            />
            <div>
              <p className="text-2xl font-bold text-gray-800">Cleaning<span className="text-2xl text-green-600 px-1">Pro</span></p>
              <p className="text-xs text-gray-500">Cleaning Services Provider</p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-xl">
          <Link href="/" className="text-gray-600 hover:text-green-500 transition-colors duration-200">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-green-500 transition-colors duration-200">
            About us
          </Link>
          <Link href="/services" className="text-gray-600 hover:text-green-500 transition-colors duration-200">
            Service
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-green-500 transition-colors duration-200">
            Blog
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-green-500 transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* Login Button */}
        <div>
          <Link
            href="/login"
            className="bg-green-500 text-white text-xl py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
          >
            Log in
          </Link>
        </div>

        {/* Mobile Menu (Hamburger Icon) -  Implementation needed */}
        {/* Add a hamburger icon here and logic to open/close a mobile menu */}
        {/* This requires state management and additional markup */}
      </div>
    </nav>
  );
};

export default Navbar;