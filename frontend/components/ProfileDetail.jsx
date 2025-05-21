"use client";
import React from "react";
import { Calendar, Users, MapPin } from "lucide-react";

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
};

function formatTimeRange(start, end) {
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
}

export default function ProfileDetail() {
  const handleBookingDateClick = () => {
    alert("You clicked the Booking Date!");
  };

  const handleTourDateClick = () => {
    alert("You clicked the Tour Date!");
  };

  const handleViewTour = () => {
    alert("Viewing Tour Details!");
    // or navigate to another page with router.push("/tour/123");
  };

  return (
    <div className="w-[600px] mx-auto bg-white rounded-xl shadow-md p-4 space-y-4 border my-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="me.jpg"
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-black">
              Kheang Senghorng
            </h2>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            {/* Title of Tour */}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Home
            </a>
            {/* describtion of Tour  */}
            <p className="text-sm text-gray-400">
              We provide good service for cleaning Home
            </p>
          </div>
          {/* Price of Tour*/}
          <span className="text-green-600 text-sm bg-green-100 px-2 py-0.5 rounded-full">
            Price : 30$
          </span>
        </div>

        {/* Location */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex flex-col text-sm text-gray-500">
            <p className="text-sm font-semibold text-green-600">Location</p>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="text-blue-600" size={18} />
              <a
                href="https://www.google.com/maps/place/Phnom+Penh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                Phnom Penh
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
            <div className="font-medium">
              <div>{formatDate("2025-05-11T17:05:36.500Z")}</div>
              <div className="text-sm text-gray-500">
                {formatTimeRange(
                  "2025-05-11T17:00:00Z",
                  "2025-05-11T18:00:00Z"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tour Date */}
        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-green-600">Tour Date</p>
          <div className="flex justify-between items-center mt-1 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-600" size={18} />
              <span className="font-medium">
                {formatDateRange("2025-05-17", "2025-05-20")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
