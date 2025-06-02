"use client";
import { use, useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import { Calendar, MapPin } from "lucide-react";
import { useStaffAssignmentStore } from "@/store/useStaffAssignmentStore";
import { useParams } from "next/navigation";

// Format date
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ProfileDetail({ userId }) {
  const { id } = useParams();
  const ownerId = id;

  const { booking, loading, error, fetchBookingById } = useBookingStoreFetch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (userId) {
      fetchBookingById(userId);
    }
  }, [userId]);

  const {
    assignedStaff,
    fetchAssignedStaff,
    assignStaff,
    loading: staffLoading,
  } = useStaffAssignmentStore();

  useEffect(() => {
    fetchAssignedStaff(ownerId);
  }, [ownerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!booking || !booking.service) return <div>No booking found.</div>;

  const { user, service, scheduled_date, scheduled_time, location } = booking;

  const handleAssignStaff = async (staffId) => {
    try {
      if (!userId || !ownerId) return;

      const assignmentPayload = [
        {
          booking_id: userId,
          staff_id: staffId,
        },
      ];

      await assignStaff(assignmentPayload, ownerId);
      alert("Staff assigned successfully!");

      // Optional: refresh assigned staff
      fetchAssignedStaff(ownerId);
    } catch (error) {
      console.error("Error assigning staff:", error);
      alert("Failed to assign staff.");
    }
  };

  // Filtered staff list based on search
  const filteredStaffList = assignedStaff.filter((staff) =>
    `${staff.firstName} ${staff.lastName} ${staff.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Staff
        </button>
      </div>

      {/* Info Section */}
      <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
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

        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-green-600">Booking Date</p>
          <div className="flex items-center gap-2 text-gray-700 mt-1">
            <Calendar className="text-blue-600" size={18} />
            <div className="font-medium">{formatDate(scheduled_date)}</div>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-sm font-semibold text-green-600">Scheduled Time</p>
          <div className="flex items-center gap-2 mt-1 text-gray-700">
            <Calendar className="text-blue-600" size={18} />
            <div className="text-sm text-gray-500">
              {scheduled_time
                ? new Date(`1970-01-01T${scheduled_time}`).toLocaleTimeString(
                    [],
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )
                : "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-green-500">
                Manage Staff
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 pt-4 flex items-center space-x-4">
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Search to find staff
              </span>

              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search staff by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>
            </div>

            {/* Staff Table */}
            <div className="overflow-x-auto px-4 py-6">
              <table className="min-w-full divide-y divide-gray-200 border rounded-md shadow-md bg-white">
                <thead className="bg-gray-100 text-gray-700 text-sm font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Image</th>
                    <th className="px-4 py-3 text-left">From</th>
                    <th className="px-4 py-3 text-left">Contact</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-sm text-gray-800">
                  {filteredStaffList.map((staff, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">#</span>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {staff.first_name || "FirstName"}{" "}
                          {staff.last_name || "LastName"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={staff.image || "/placeholder.svg"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          {staff.from || "CleanPro Ltd."}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <div className="flex items-center mb-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {staff.email}
                          </div>
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 text-green-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-.586 1.414L7.414 9.414a16.016 16.016 0 006.172 6.172l.586-.586A2 2 0 0115 14h2a2 2 0 012 2v2a2 2 0 01-2 2h-1C8.82 20 4 15.18 4 9V8a2 2 0 01-1-1V5z"
                              />
                            </svg>
                            {staff.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleAssignStaff(staff.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStaffList.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-gray-400 py-4"
                      >
                        No staff found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
