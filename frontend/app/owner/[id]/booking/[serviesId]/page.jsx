"use client";

import React, { useState } from "react";
import GuestListComponent from "@/components/GuestListComponent";

export default function TourDetails() {
  const [accommodationOptions, setAccommodationOptions] = useState({
    ac: false,
    heating: false,
    dishwasher: false,
    petsAllowed: false,
    fitnessCenter: false,
    airportTransfer: false,
    transfer: false,
    spa: false,
    pool: false,
  });

  const handleAccommodationChange = (option) => {
    setAccommodationOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="flex justify-between items-start mb-4">
        <div className="w-1/2 pr-4">
          {/* Left Column */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">
                <span className="mr-2">
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 110-4h10a2 2 0 110 4H7z"
                    ></path>
                  </svg>
                  ID: TTHH3
                </span>
              </div>
              <div className="text-sm text-gray-500">Created: Invalid Date</div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-xs text-gray-600">
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Start Date
                </div>
                <div className="text-sm font-medium">May 17, 2025</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-xs text-gray-600">
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  End Date
                </div>
                <div className="text-sm font-medium">May 20, 2025</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-xs text-gray-600">
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197H9v-1a6 6 0 0112 0v1zm0 0V5.646a4.5 4.5 0 10-9 0V21h6z"
                    ></path>
                  </svg>
                  Bookings
                </div>
                <div className="text-sm font-medium">2/40</div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-xs text-gray-600">
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Price
                </div>
                <div className="text-sm font-medium">$100.00</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-gray-700 mb-2">
                Description
              </div>
              <div className="text-sm text-gray-600">fbi</div>
            </div>

            <div>
              <div className="text-xs font-bold text-gray-700 mb-2">
                Accommodation
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {Object.entries(accommodationOptions).map(([option, value]) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      checked={value}
                      onChange={() => handleAccommodationChange(option)}
                    />
                    <span className="ml-2 text-gray-700 text-sm capitalize">
                      {option.replace(/([A-Z])/g, " $1")}
                    </span>
                  </label>
                ))}
              </div>
              <div className="text-sm text-gray-500">Selected: None</div>
            </div>

            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg mt-4 hover:bg-purple-700">
              Save Accommodation
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-xs font-bold text-gray-700 mb-2">
              Quick Info
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <svg
                className="inline-block w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                ></path>
              </svg>
              Location
              <div>Phnom Penh </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">
              <svg
                className="inline-block w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Duration
              <div>3 days</div>
            </div>

            <div className="text-sm text-gray-600">
              <svg
                className="inline-block w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197H9v-1a6 6 0 0112 0v1zm0 0V5.646a4.5 4.5 0 10-9 0V21h6z"
                ></path>
              </svg>
              Group Size
              <div>Maximum participants</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-gray-700">
                Additional Info
              </div>
              <div className="text-xs text-blue-600">
                <svg
                  className="inline-block w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-2">
              Confirmation will be received at time of booking
              <svg
                className="inline-block w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 114 0h2a2 2 0 114 0m-6 9v3m-3-3h2.5M15 12h2.5"
                ></path>
              </svg>
            </div>
            <div className="text-xs text-gray-600 mb-2">
              Not wheelchair accessible
              <svg
                className="inline-block w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 114 0h2a2 2 0 114 0m-6 9v3m-3-3h2.5M15 12h2.5"
                ></path>
              </svg>
            </div>
            <div className="text-xs text-gray-600 mb-2">
              Not wheelchair accessible
              <svg
                className="inline-block w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 114 0h2a2 2 0 114 0m-6 9v3m-3-3h2.5M15 12h2.5"
                ></path>
              </svg>
            </div>
            <div className="text-xs text-gray-600">
              Not wheelchair accessible
              <svg
                className="inline-block w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 114 0h2a2 2 0 114 0m-6 9v3m-3-3h2.5M15 12h2.5"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          {/* Right Column */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="text-xs font-bold text-gray-700 mb-2">
              Tour Gallery
            </div>
            <div className="mb-2">
              <img
                src="https://picsum.photos/id/1015/400/300"
                alt="Tour"
                className="rounded-lg"
              />
            </div>
            <div className="flex space-x-2 mb-4">
              <img
                src="https://picsum.photos/id/1016/150/100"
                alt="Tour"
                className="rounded-lg w-1/3"
              />
              <img
                src="https://picsum.photos/id/1018/150/100"
                alt="Tour"
                className="rounded-lg w-1/3"
              />
              <img
                src="https://picsum.photos/id/1019/150/100"
                alt="Tour"
                className="rounded-lg w-1/3"
              />
            </div>
            <div className="text-sm text-blue-600 text-center">
              View All Photos (4)
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-gray-700">
                Tour Itinerary
              </div>
              <div className="text-xs text-green-500">0% Complete</div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <svg
                className="inline-block w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                ></path>
              </svg>
              Phnom Penh
            </div>
            <div className="bg-green-50 rounded-lg p-3 mb-2">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-sm">
                  1
                </div>
                <div>
                  <div className="text-sm font-medium">May 09, 25</div>
                  <div className="text-sm text-gray-600">efg76y</div>
                  <div className="text-sm text-gray-600">3rhify</div>
                  <div className="text-xs text-gray-500">22:33 - 22:33</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-green-600 text-center">
              Check Tour End Time/Day
            </div>
          </div>
        </div>
      </div>

    <GuestListComponent />

    </div>
   
  );
}
