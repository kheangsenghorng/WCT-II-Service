"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useBookingStoreFetch } from "@/store/bookingStore";

export default function GuestListPage() {
  const params = useParams();

  const ownerId = params?.id;
  const serviceId = params?.serviceId || params?.serviesId;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    fetchServiceBookings,
    userBookings = [],
    stats,
    loading,
    error,
  } = useBookingStoreFetch();

  useEffect(() => {
    if (ownerId && serviceId) {
      fetchServiceBookings(ownerId, serviceId);
    }
  }, [ownerId, serviceId, fetchServiceBookings]);

  const totalGuests = userBookings.length;
  const totalPages = Math.ceil(totalGuests / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBookings = userBookings.slice(startIndex, endIndex);

  // Optional: define handleClick or remove it if not needed
  const handleClick = (e) => {
    // e.preventDefault();
    // Implement if needed
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Guest List</h2>
          <div>
            <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded-full text-xs font-medium mr-2">
              Total Bookings: {stats?.total_booking_count || 0}
            </span>
            <span className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-xs font-medium">
              Total Users: {stats?.unique_users_count || 0}
            </span>
          </div>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-gray-500">Loading guest data...</p>}
        {error && (
          <p className="text-red-500">Error loading data: {error.message}</p>
        )}

        {!loading && !error && (
          <>
            {/* Table Headers */}
            <div className="grid grid-cols-7 gap-4 text-xs font-bold text-gray-600 uppercase border-b pb-2">
              <div>#</div>
              <div>Guest</div>
              <div>Email</div>
              <div>Booking Count</div>
              <div>Total</div>
              <div className="col-span-2">Details</div>
            </div>

            {/* Table Rows */}
            {paginatedBookings.map((guest, index) => {
              // Defensive href variables
              const guestUserId = guest.user?.id || "unknownUser";
              const guestBookingId = guest.id || "unknownBooking";

              return (
                <div
                  key={guest.id || index}
                  className="grid grid-cols-7 gap-4 py-4 items-center border-b border-gray-100"
                >
                  <div>{startIndex + index + 1}</div>
                  <div className="flex items-center">
                    <img
                      src={guest.user?.image || "https://i.pravatar.cc/40"}
                      alt={guest.user?.first_name || "Guest"}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {guest.user?.first_name} {guest.user?.last_name}
                  </div>
                  <div>{guest.user?.email || "N/A"}</div>
                  <div>{guest.booking_count || 0}</div>
                  <div>${guest.total_price || 0}</div>
                  <div className="col-span-2">
                    <Link
                      href={`/owner/${ownerId}/booking/${serviceId}/${guestUserId}`}
                      onClick={handleClick}
                      className="inline-flex"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <div>
                Showing {startIndex + 1}–{Math.min(endIndex, totalGuests)} of{" "}
                {totalGuests} guests
              </div>
              <div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`py-1 px-2 rounded-lg mr-1 ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-100"
                  }`}
                >
                  Previous
                </button>

                <button className="py-1 px-3 rounded-lg bg-blue-500 text-white mr-1">
                  {currentPage}
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`py-1 px-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400"
                      : "bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
