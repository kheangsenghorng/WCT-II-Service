"use client";

import React, { useEffect } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import { Calendar, Users, MapPin } from "lucide-react";

// Format Date
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format Time Range
const formatTimeRange = (start, end) => {
  if (!start || !end) return "N/A";
  const startTime = new Date(start).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const endTime = new Date(end).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${startTime} - ${endTime}`;
};

export default function ProfileDetail({ userId }) {
  const { booking, loading, error, fetchBookingById } = useBookingStoreFetch();

  useEffect(() => {
    if (userId) {
      fetchBookingById(userId);
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!booking || !booking.service) return <div>No booking found.</div>;

  const { user, service, scheduled_date, scheduled_time, location } = booking;

  return (
    <div className="w-[600px] mx-auto bg-white rounded-xl shadow-md p-4 space-y-4 border my-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src={user?.image || "/default-avatar.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => (e.target.src = "/me.jpg")}
          />
          <div>
            <h2 className="text-lg font-semibold text-black">
              {user?.first_name} {user?.last_name}
            </h2>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
        {/* Service Info */}
        <div className="flex justify-between items-center">
          <div>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              {service?.name || "Home"}
            </a>
            <p className="text-sm text-gray-400">
              {service?.description ||
                "We provide good service for cleaning Home"}
            </p>
          </div>
          <span className="text-green-600 text-sm bg-green-100 px-2 py-0.5 rounded-full">
            ${service?.base_price}
          </span>
        </div>

        {/* Location */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex flex-col text-sm text-gray-500">
            <p className="text-sm font-semibold text-green-600">Location</p>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="text-blue-600" size={18} />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  location || "Phnom Penh"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {location || "Phnom Penh"}
              </a>
            </div>
          </div>
          <span className="text-sm text-gray-500">City</span>
        </div>

        {/* Booking Date */}
        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-green-600">Booking Date</p>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <Calendar className="text-blue-600" size={18} />
            <div className="font-medium">{formatDate(scheduled_date)}</div>
          </div>
        </div>

        {/* Scheduled Time */}
        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-green-600">Scheduled Time</p>
          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <Calendar className="text-blue-600" size={18} />
              <div className="text-sm text-gray-500">
                {scheduled_time ? (
                  new Date(`1970-01-01T${scheduled_time}`).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                ) : (
                  "N/A"
                )}
              </div>

          </div>
        </div>
      </div>
    </div>
  );
}
