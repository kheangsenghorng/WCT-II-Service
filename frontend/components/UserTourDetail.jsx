"use client";

import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import { useStaffAssignmentStore } from "../store/useStaffAssignmentStore";
import { Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function UserTourHistory({ userId, bookingId }) {
  const { id, serviesId } = useParams();

  const { bookings, loading, error, fetchBookingsByUserAndService } =
    useBookingStoreFetch();

  useEffect(() => {
    if (userId && serviesId) {
      fetchBookingsByUserAndService(userId, serviesId);
    }
  }, [userId, serviesId]);

  const {
    staffByBooking,
    fetchStaffByBooking,
    unassignStaff,
    loading: staffLoading,
  } = useStaffAssignmentStore();



  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // ✅ View staff from booking
  // const handleViewStaff = async (staffArrayFromBooking) => {
  //   // Directly call the API to ensure you have the latest staff assigned
  //   await fetchStaffByBooking(bookingId);

  //   // Determine which source of staff data to use
  //   const sourceArray =
  //     Array.isArray(staffByBooking) && staffByBooking.length > 0
  //       ? staffByBooking
  //       : staffArrayFromBooking;

  //   if (sourceArray && sourceArray.length > 0) {
  //     const formattedStaff = sourceArray.map((staff) => ({
  //       id: staff.id,
  //       name: `${staff.first_name} ${staff.last_name}`,
  //       profile: staff.image || "/images/default-avatar.png",
  //       company: staff.role === "staff" ? "Internal Team" : "External Partner",
  //       contact: staff.phone || "N/A",
  //     }));
  //     setSelectedStaff(formattedStaff);
  //   } else {
  //     setSelectedStaff([]);
  //   }
  //   setShowStaffModal(true);
  // };

  const handleDeleteStaff = async (indexToRemove) => {
    const staffToRemove = selectedStaff[indexToRemove];
    if (!staffToRemove || !staffToRemove.id || !bookingId) return;

    // const confirmDelete = window.confirm(
    //   `Are you sure you want to remove ${staffToRemove.name}?`
    // );
    // if (!confirmDelete) return;

    try {
      await unassignStaff(bookingId, staffToRemove.id); // Call backend
      const updatedStaff = selectedStaff.filter((_, i) => i !== indexToRemove);
      setSelectedStaff(updatedStaff);

      toast.success(`${staffToRemove.name} removed from booking.`);
    } catch (err) {
      console.error("Failed to unassign staff:", err);
      toast.error("Failed to unassign staff. Please try again.");
    }
  };

  const closeModal = () => {
    setShowStaffModal(false);
    setSelectedStaff(null);
  };

  const removeStaff = () => {
    console.log("Removing staff...");
    alert("Staff removed successfully.");
    setSelectedStaff(null);
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
        <h2 className="text-xl font-semibold text-gray-800">
          User Service History
        </h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Total Price: <strong>${totalPrice}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-green-600">
                Service
              </th>
              <th className="px-4 py-3 font-semibold text-green-600 w-48">
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
              {/* <th className="px-4 py-3 font-semibold text-green-600">Staff</th> */}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    <Link
                      href={`/owner/${id}/booking/${booking?.service?.id}/${userId}/${booking?.id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={
                          booking?.service?.images?.[0] || "/placeholder.jpg"
                        }
                        alt={booking?.service?.name || "Service Image"}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-500">#{index + 1}</p>
                        <p className="font-medium text-gray-800">
                          {booking?.service?.name || "Unnamed Service"}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td
                    className="px-4 py-3 max-w-[12rem] truncate"
                    title={booking?.location}
                  >
                    {booking?.location}
                  </td>
                  <td className="px-4 py-3">{booking?.scheduled_date}</td>
                  <td className="px-4 py-3">
                    {booking?.scheduled_time
                      ? new Date(
                          `1970-01-01T${booking.scheduled_time}`
                        ).toLocaleTimeString([], {
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
                  {/* <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewStaff(booking.id)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Eye size={16} />
                      View Staff
                    </button>
                  </td> */}
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
          <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={closeModal}
                className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
              >
                &times;
              </button>

              <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Staff Details
              </h2>

              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3  text-green-500">Name</th>
                    <th className="px-4 py-3  text-green-500">Profile</th>
                    <th className="px-4 py-3  text-green-500">
                      From (Company)
                    </th>
                    <th className="px-4 py-3  text-green-500">Contact</th>
                    <th className="px-4 py-3  text-green-500">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStaff.map((staff, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-bold text-gray-900">
                        {staff.name}
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={staff.profile || "/images/default-profile.jpg"}
                          alt={staff.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {staff.company}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {staff.contact}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteStaff(index)}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
