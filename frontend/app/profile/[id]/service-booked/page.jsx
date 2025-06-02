"use client"

import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useBookingStoreFetch } from "@/store/bookingStore";
import { useParams } from "next/navigation";
import Link from "next/link";

const BookedServiceCard = () => {
  const { id } = useParams();
  const userId = id;
  const { bookings, loading, error, fetchBookingsByUserId } =
    useBookingStoreFetch();

  // NEW: Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 3;

  useEffect(() => {
    if (userId) {
      fetchBookingsByUserId(userId)
    }
  }, [userId])

  const getCategoryColor = (category) => {
    const colors = {
      Clear: "bg-purple-500",
      "Beauty & Wellness": "bg-pink-500",
      Automotive: "bg-blue-500",
      "Health & Fitness": "bg-green-500",
    };
    return colors[category] || "bg-gray-500";
  };

  console.log("Bookings:", bookings);

  // Compute pagination
  const totalBookings = bookings?.length || 0;
  const totalPages = Math.ceil(totalBookings / bookingsPerPage);
  const startIndex = (currentPage - 1) * bookingsPerPage;
  const endIndex = startIndex + bookingsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!bookings || bookings.length === 0)
    return <p className="text-center">No bookings found.</p>;

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {currentBookings.map((booking, index) => {
        const service = booking.service;
        if (!service) return null;

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden gap-x-8 hover:shadow-lg transition-shadow duration-300 flex"
          >
            {/* Service Image */}
            <div className="relative w-1/3 min-w-[200px] max-w-[300px]">
              <img
                src={
                  service.images && service.images.length > 0
                    ? service.images[0]
                    : "/placeholder.jpg"
                }
                alt={service.name || "Service Image"}
                className="w-full h-full object-cover"
              />
            </div>

                      {/* Content */}
                      <div className="flex-1 p-6 lg:p-8">
                        {/* Service Info */}
                        <div className="mb-6">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {service.name || "Service Name"}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base line-clamp-2">
                            {service.description || "No description available."}
                          </p>
                        </div>

                        {/* Service Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Service Created</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Date(service?.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Provider</p>
                                <p className="font-medium text-gray-900 dark:text-white">{service.provider}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Booking Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
                              <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Time</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Date(`1970-01-01T${booking.scheduled_time}`).toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-500">Location</p>
                            <p className="font-medium text-gray-900 dark:text-white">{booking.location}</p>
                          </div>
                        </div>

              {/* Price and View Detail */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-gray-900">
                  ${service.base_price || "0.00"}
                </span>
                <Link
                  href={`/profile/${userId}/view-detail/${service.id}/${booking.id}`}
                >
                  <button
                    type="button"
                    className="text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 font-medium text-sm px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-1"
                  >
                    View Detail
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {startIndex + 1}–{Math.min(endIndex, totalBookings)} of{" "}
          {totalBookings} bookings
        </div>
        <div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`py-1 px-2 rounded-lg mr-1 ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-gray-100 hover:bg-gray-200"
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
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookedServiceCard
