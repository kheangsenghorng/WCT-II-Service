"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Search } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Single notification item
const NotificationItem = ({ notification }) => {
  const { id } = useParams();
  const { markAsRead, loading } = useNotificationStore();
  const { user, message, created_at, is_read, service } = notification;

  const handleClick = () => {
    if (!is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <Link
      href={`/owner/${id}/booking/${service?.id}/${user?.id}/${notification?.booking_id}`}
      className="block"
      onClick={handleClick}
    >
      <div
        className={clsx(
          "flex items-start gap-3 rounded-lg p-4 mb-3 border transition-shadow shadow-sm",
          is_read
            ? "bg-white border-gray-200 hover:shadow-md"
            : "bg-blue-50 border-blue-200 hover:shadow-lg"
        )}
      >
        <img
          src={user?.image || "/default-avatar.png"}
          alt={`${user?.first_name || "Unknown"} ${user?.last_name || ""}`}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <p className={clsx("font-medium", !is_read && "text-blue-900")}>
            {message}
          </p>
          <p className="text-sm text-gray-500">{dayjs(created_at).fromNow()}</p>
          <p className="text-xs text-gray-400 mt-1">
            From: {user?.first_name || "Unknown"} {user?.last_name || ""}
          </p>
        </div>
      </div>
    </Link>
  );
};

// Badge display
const Badge = ({ label, count, color }) => (
  <span
    className={clsx(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      `bg-${color}-100 text-${color}-800`
    )}
  >
    {label}
    <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-current" />
    {count}
  </span>
);

const NotificationsPanel = ({ onClose }) => {
  const { id } = useParams();
  const { notifications, fetchMyNotifications, markAsRead, loading } =
    useNotificationStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (id) {
      fetchMyNotifications(id);
    }
  }, [id, fetchMyNotifications]);

  const filteredNotifications = notifications?.filter((n) =>
    n?.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Slide-in Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close notifications panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
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
        <div className="flex items-center px-4 pb-2 space-x-2">
          <Badge
            label="All"
            count={notifications?.length || 0}
            color="orange"
          />
          <Badge
            label="Unread"
            count={notifications?.filter((n) => n.is_read === 0).length}
            color="blue"
          />
          <Badge
            label="Read"
            count={notifications?.filter((n) => n.is_read === 1).length}
            color="gray"
          />
        </div>

        {/* Notifications List */}
        <div className="p-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : filteredNotifications?.length === 0 ? (
            <div className="text-center text-gray-500">
              No notifications found.
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t text-center">
          <Link href="/notifications" className="text-blue-500 hover:underline">
            View all notifications
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationsPanel;
