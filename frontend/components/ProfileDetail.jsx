"use client";
import React from "react";
import { Calendar, Users } from "lucide-react";

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
            <h2 className="text-lg font-semibold text-black">Kheang Senghorng</h2>
            
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <a href="#" className="text-blue-600 font-medium hover:underline">Any where</a>
            <p className="text-sm text-gray-400">#TTHH3</p>
          </div>
          <span className="text-green-600 text-sm bg-green-100 px-2 py-0.5 rounded-full">Close</span>
        </div>

        {/* Sit */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex flex-col text-sm text-gray-500">
            <span>Sit</span>
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={18} />
              <span className="font-medium">2</span>
            </div>
          </div>
          <span className="text-sm text-gray-500">People</span>
        </div>

        {/* Booking Date - Clickable */}
        <div
          onClick={handleBookingDateClick}
          className="cursor-pointer border-t pt-3"
        >
          <p className="text-sm text-gray-500">Booking Date</p>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <Calendar size={18} />
            <span className="font-medium">{formatDate("2025-05-11T17:05:36.500Z")}</span>
          </div>
        </div>

        {/* Tour Date - Clickable */}
        <div
          onClick={handleTourDateClick}
          className="cursor-pointer border-t pt-3"
        >
          <p className="text-sm text-gray-500">Tour Date</p>
          <div className="flex justify-between items-center mt-1 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="font-medium">
                {formatDateRange("2025-05-17", "2025-05-20")}
              </span>
            </div>
            <button
              onClick={handleViewTour}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              View Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
