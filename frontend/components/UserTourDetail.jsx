"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";

export default function UserTourHistory({ userId }) {
  const { id, serviesId } = useParams();
  // console.log(id);
  // console.log(serviesId);

  const { bookings, loading, error, fetchBookingsByUserAndService } =
    useBookingStoreFetch();

  // console.log(bookings);

  useEffect(() => {
    if (userId && serviesId) {
      fetchBookingsByUserAndService(userId, serviesId);
    }
  }, [userId, serviesId]);

  const totalPrice = Array.isArray(bookings)
    ? bookings.reduce((acc, item) => {
        const basePrice = parseFloat(item?.service?.base_price || "0");
        return acc + basePrice;
      }, 0)
    : 0;

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!bookings) return <div>No booking found.</div>;

  return (
    <div className="w-[1200px] mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          User Service History
        </h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Total Price: <strong>${totalPrice}</strong>
        </div>
      </div>

      {loading && <p className="text-gray-500 mb-4">Loading bookings...</p>}
      {error && (
        <p className="text-red-500 mb-4">Error fetching bookings: {error}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-green-600">
                Service
              </th>
              <th className="px-4 py-3 font-semibold text-green-600">
                Location
              </th>
              <th className="px-4 py-3 font-semibold text-green-600">
                Booked Date
              </th>
              <th className="px-4 py-3 font-semibold text-green-600">
                Scheduled Time
              </th>
              <th className="px-4 py-3 font-semibold text-green-600">Status</th>
              <th className="px-4 py-3 font-semibold text-green-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={booking?.service?.images?.[0] || "/placeholder.jpg"}
                      alt={booking?.service?.name || "Service Image"}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-500">#{booking?.id}</p>
                      <p className="font-medium text-gray-800">
                        {booking?.service?.name || "Unnamed Service"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">{booking?.location}</td>
                  <td className="px-4 py-3">{booking?.scheduled_date}</td>
                  <td className="px-4 py-3">{booking?.scheduled_time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        booking?.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {booking?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    ${parseFloat(booking?.service?.base_price || "0")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
