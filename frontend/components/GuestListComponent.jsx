"use client";

import React from "react";

const guestList = [
  {
    id: 1,
    guest: "John Doe",
    email: "john@example.com",
    booking: "Phnom Penh Tour",
    noGuests: 2,
    total: 120,
    imageSrc: "https://i.pravatar.cc/40?img=1",
  },
  {
    id: 2,
    guest: "Jane Smith",
    email: "jane@example.com",
    booking: "Angkor Wat Tour",
    noGuests: 3,
    total: 180,
    imageSrc: "https://i.pravatar.cc/40?img=2",
  },
];

export default function GuestListPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Guest List</h2>
          <div>
            <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded-full text-xs font-medium mr-2">
              Total Bookings: 5
            </span>
            <span className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
              Total Users: 2
            </span>
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-7 gap-4 text-xs font-bold text-gray-600 uppercase">
          <div>ID</div>
          <div>Guest</div>
          <div>Email</div>
          <div>Booking</div>
          <div>No. Guests</div>
          <div>Total</div>
          <div>Details</div>
        </div>

        {/* Table Rows */}
        {guestList.map((guest) => (
          <div
            key={guest.id}
            className="grid grid-cols-7 gap-4 py-4 items-center border-b border-gray-200"
          >
            <div>{guest.id}</div>
            <div className="flex items-center">
              <img
                src={guest.imageSrc}
                alt={guest.guest}
                className="w-8 h-8 rounded-full mr-2"
              />
              {guest.guest}
            </div>
            <div>{guest.email}</div>
            <div>{guest.booking}</div>
            <div>{guest.noGuests}</div>
            <div>${guest.total}</div>
            <div>
              <svg
                className="w-4 h-4 text-gray-500 cursor-pointer"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>Showing {guestList.length} of {guestList.length} guests</div>
          <div>
            <button className="py-1 px-2 rounded-lg bg-gray-100 mr-1">Previous</button>
            <button className="py-1 px-2 rounded-lg bg-blue-500 text-white mr-1">1</button>
            <button className="py-1 px-2 rounded-lg bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
