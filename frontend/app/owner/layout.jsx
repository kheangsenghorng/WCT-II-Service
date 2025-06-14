"use client";

import React from "react";
import AdminNavbar from "../../components/Adminheader";
import SidebarCompany from "../../components/SidebarCompany";
import { useParams } from "next/navigation";
// import BookingListener from "../../components/BookingListener";
// import { SessionProvider } from "next-auth/react";

const AdminLayout = ({ children }) => {
  const params = useParams();
  const { id } = params; // `params` is an object

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* 🔔 Real-time Booking Listener */}
      {/* <BookingListener ownerId={id} /> */}

      {/* Navbar */}
      <AdminNavbar id={id} className="bg-white border-b border-gray-200" />

      {/* Sidebar below navbar */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <SidebarCompany id={id} className="w-full md:w-64 flex-shrink-0" />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Footer (Optional) */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-3 px-6 text-center text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Admin Panel</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
