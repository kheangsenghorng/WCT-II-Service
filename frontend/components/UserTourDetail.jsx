"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import { Eye } from "lucide-react";

export default function UserTourHistory({ userId }) {
  const { id, serviesId } = useParams();

  const { bookings, loading, error, fetchBookingsByUserAndService } =
    useBookingStoreFetch();

  useEffect(() => {
    if (userId && serviesId) {
      fetchBookingsByUserAndService(userId, serviesId);
    }
  }, [userId, serviesId]);


  // Staff
const [showStaffModal, setShowStaffModal] = useState(false);
const [selectedStaff, setSelectedStaff] = useState(null);

const handleViewStaff = (staff) => {
  setSelectedStaff(staff || {
    name: "John Doe",
    profile: "/images/default-profile.jpg",
    company: "CleanPro Ltd.",
    contact: "012 345 678"
  });
  setShowStaffModal(true);
};

const closeModal = () => {
  setShowStaffModal(false);
};




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
        <h2 className="text-xl font-semibold text-gray-800">User Service History</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Total Price: <strong>${totalPrice}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-green-600">Service</th>
              <th className="px-4 py-3 font-semibold text-green-600 w-48">Location</th>
              <th className="px-4 py-3 font-semibold text-green-600">Booked Date</th>
              <th className="px-4 py-3 font-semibold text-green-600">Scheduled Time</th>
              <th className="px-4 py-3 font-semibold text-green-600">Status</th>
              <th className="px-4 py-3 font-semibold text-green-600">Price</th>
              <th className="px-4 py-3 font-semibold text-green-600">Staff</th>
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
                  <td className="px-4 py-3 max-w-[12rem] truncate" title={booking?.location}>
                    {booking?.location}
                  </td>
                  <td className="px-4 py-3">{booking?.scheduled_date}</td>
                  <td className="px-4 py-3">
                    {booking?.scheduled_time
                      ? new Date(`1970-01-01T${booking.scheduled_time}`).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "N/A"}
                  </td>
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
                  <td className="px-4 py-3">
                   
                      <button
                        onClick={() => handleViewStaff(booking.staff)}
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Eye size={16} />
                        View Staff
                      </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
            

            {showStaffModal && selectedStaff && (
  <div className="fixed inset-0  shadow-lg bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
      {/* Close button */}
      <button
        onClick={closeModal}
        className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
      >
        &times;
      </button>

      {/* Modal content */}
      <div className="flex flex-col items-center text-center">
        <img
          src={selectedStaff.profile || "/placeholder.jpg"}
          alt={selectedStaff.name}
          className="w-24 h-24 rounded-full object-cover mb-4 border border-gray-300"
        />

        <h3 className="text-xl font-semibold text-gray-800 mb-2">{selectedStaff.name}</h3>

        <p className="text-gray-600 mb-1">
          <span className="font-medium text-gray-800">From:</span> {selectedStaff.company}
        </p>

        <p className="text-gray-600">
          <span className="font-medium text-gray-800">Contact:</span> {selectedStaff.contact}
        </p>
      </div>
    </div>
  </div>
)}

 
      </div>
    </div>
  );
}
