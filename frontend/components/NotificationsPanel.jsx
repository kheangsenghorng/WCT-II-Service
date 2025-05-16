"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Search, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

const NotificationItem = ({ icon, title, time, isToday }) => (
  <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-100 transition-colors duration-200">
    <div className="flex items-center">
      <span className="mr-3">{icon}</span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">
          {isToday ? time : `${time} ago`}
        </div>
      </div>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-arrow-right"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  </div>
);

const Badge = ({ label, count, color }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      `bg-${color}-100`,
      `text-${color}-800`
    )}
  >
    {label}
    <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-current"></span>
    {count}
  </span>
);

const NotificationsPanel = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-opacity-30 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-xl overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark all as read */}
        <div className="flex items-center justify-end px-4 pt-2">
          <button className="flex items-center text-sm text-blue-600 hover:underline">
            Mark all as read
            <CheckCircle2 className="ml-1 h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center justify-start p-4 space-x-2">
          <Badge label="All" count={5} color="orange" />
          <Badge label="Urgent" count={1} color="red" />
          <Badge label="Normal" count={2} color="gray" />
          <Badge label="Resolved" count={2} color="green" />
        </div>

        {/* Today */}
        <div className="p-4">
          <h3 className="text-gray-500 text-sm mb-2">Today</h3>
          <NotificationItem
            icon={<span className="text-red-500">🔥</span>}
            title="Scania R450 (NG001) engine overheating."
            time="5mins"
            isToday={true}
          />
          <NotificationItem
            icon={<span className="text-orange-500">🚧</span>}
            title="Ngozi Uchenna is delayed at checkpoint."
            time="09:45 AM"
            isToday={true}
          />
          <NotificationItem
            icon={<span className="text-orange-500">🛠️</span>}
            title="Volvo FH16 scheduled for maintenance today."
            time="09:30 AM"
            isToday={true}
          />
        </div>

        {/* Yesterday */}
        <div className="p-4">
          <h3 className="text-gray-500 text-sm mb-2">Yesterday</h3>
          <NotificationItem
            icon={<span className="text-green-500">✅</span>}
            title="Kenworth T680 delivery completed (Route A)."
            time="1 day"
            isToday={false}
          />
          <NotificationItem
            icon={<span className="text-green-500">✅</span>}
            title="Volvo FH16 scheduled maintenance completed."
            time="22 hrs"
            isToday={false}
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-center">
          <a href="#" className="text-blue-500 hover:underline">
            View all notifications
          </a>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationsPanel;
