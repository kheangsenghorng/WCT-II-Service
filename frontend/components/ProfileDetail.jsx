"use client";
import { useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import { Calendar, MapPin } from "lucide-react";
import { useStaffAssignmentStore } from "@/store/useStaffAssignmentStore";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

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
  const { id: ownerId } = useParams();
  const bookingId = userId;

  const { booking, loading, error, fetchBookingById } = useBookingStoreFetch();
  const {
    assignedStaff,
    staffByBooking,
    fetchStaffByBooking,
    unassignStaff,
    fetchAssignedStaff,
    assignStaff,
    loading: staffLoading,
  } = useStaffAssignmentStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAttachment, setActiveAttachment] = useState("details");

  useEffect(() => {
    if (userId) {
      fetchBookingById(userId);
    }
  }, [userId, fetchBookingById]);

  useEffect(() => {
    if (ownerId && bookingId) {
      fetchAssignedStaff(ownerId);
      fetchStaffByBooking(bookingId);
    }
  }, [ownerId, bookingId, fetchAssignedStaff, fetchStaffByBooking]);

  const handleAssignStaff = async (staffId) => {
    try {
      if (!userId || !ownerId) return;
      const assignmentPayload = [{ booking_id: userId, staff_id: staffId }];
      await assignStaff(assignmentPayload, ownerId);
      toast.success("Staff assigned successfully!");
      fetchAssignedStaff(ownerId);
    } catch (err) {
      console.error("Error assigning staff:", err);
      toast.error("Failed to assign staff.");
    }
  };

  const handleDeleteStaff = async (indexToRemove) => {
    const staffToRemove = staffByBooking[indexToRemove];
    if (!staffToRemove || !staffToRemove.id || !bookingId) return;

    try {
      await unassignStaff(bookingId, staffToRemove.id);
      toast.success(`${staffToRemove.first_name} removed from booking.`);
      fetchStaffByBooking(bookingId);
    } catch (err) {
      console.error("Failed to unassign staff:", err);
      toast.error("Failed to unassign staff. Please try again.");
    }
  };

  const filteredStaffList = assignedStaff.filter((staff) =>
    `${staff.first_name} ${staff.last_name} ${staff.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!booking || !booking.service) return <div>No booking found.</div>;

  const { user, service, scheduled_date, scheduled_time, location } = booking;

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
        <div className="flex gap-2">
          {["details", "attachments"].map((type) => (
            <button
              key={type}
              className={`text-sm font-medium py-2 px-4 rounded-lg ${
                activeAttachment === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveAttachment(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Staff
          </button>
        </div>
      </div>

      {/* Info Section */}
      {activeAttachment === "details" ? (
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
            <p className="text-sm font-semibold text-green-600">
              Scheduled Time
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-700">
              <Calendar className="text-blue-600" size={18} />
              <div className="text-sm text-gray-500">
                {scheduled_time
                  ? new Date(`1970-01-01T${scheduled_time}`).toLocaleTimeString(
                      [],
                      { hour: "numeric", minute: "2-digit", hour12: true }
                    )
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <h3 className="text-lg font-semibold text-green-600">
            Staff Attachments
          </h3>
          {staffByBooking && staffByBooking.length > 0 ? (
            <table className="min-w-full text-sm text-left text-gray-500">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {staffByBooking.map((staff, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">#{index + 1}</td>
                    <td className="px-4 py-3">
                      {staff.first_name} {staff.last_name}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={staff.image || "/placeholder.svg"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">{staff.from || "CleanPro Ltd."}</td>
                    <td className="px-4 py-3">{staff.email}</td>
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No attachments available for this booking</p>
            </div>
          )}
        </div>
      )}

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
                  className="h-6 w-6"
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
              <span className="text-gray-700 font-medium">
                Search to find staff
              </span>
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
              />
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
                    <tr key={index}>
                      <td className="px-4 py-3">#{index + 1}</td>
                      <td className="px-4 py-3">
                        {staff.first_name} {staff.last_name}
                      </td>
                      <td className="px-4 py-3">
                        <img
                          src={staff.image || "/placeholder.svg"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-3">{staff.from || "CleanPro Ltd."}</td>
                      <td className="px-4 py-3">{staff.email}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleAssignStaff(staff.id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-xs"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
