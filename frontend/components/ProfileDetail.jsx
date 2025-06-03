"use client";
import { useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import {
  Calendar,
  MapPin,
  Users,
  X,
  Search,
  Plus,
  Trash2,
  Clock,
  DollarSign,
} from "lucide-react";
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

  if (loading) {
    return (
      <div className="w-[700px] mx-auto my-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-300 rounded-xl"></div>
              <div className="h-24 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[700px] mx-auto my-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="text-red-600 text-lg font-semibold">
            Oops! Something went wrong
          </div>
          <div className="text-red-500 mt-2">{error}</div>
        </div>
      </div>
    );
  }

  if (!booking || !booking.service) {
    return (
      <div className="w-[700px] mx-auto my-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="text-yellow-600 text-lg font-semibold">
            No booking found
          </div>
          <div className="text-yellow-500 mt-2">
            The booking you're looking for doesn't exist.
          </div>
        </div>
      </div>
    );
  }

  const { user, service, scheduled_date, scheduled_time, location } = booking;

  return (
    <div className="w-[700px] mx-auto my-8">
      <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-blue-100 text-sm">Customer Profile</p>
              </div>
            </div>

            <div className="flex gap-3">
              {["details", "attachments"].map((type) => (
                <button
                  key={type}
                  className={`text-sm font-medium py-2.5 px-5 rounded-xl transition-all duration-200 ${
                    activeAttachment === type
                      ? "bg-white text-blue-600 shadow-lg transform scale-105"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  }`}
                  onClick={() => setActiveAttachment(type)}
                >
                  {type === "details" ? (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Details
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      Staff ({staffByBooking?.length || 0})
                    </div>
                  )}
                </button>
              ))}
              <button
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-medium py-2.5 px-5 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                Add Staff
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {activeAttachment === "details" ? (
            <div className="space-y-6">
              {/* Service Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {service?.name || "Home Cleaning Service"}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service?.description ||
                        "Professional home cleaning service with attention to detail"}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                      <DollarSign size={16} />
                      <span className="font-bold">{service?.base_price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Location Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MapPin className="text-white" size={20} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Location
                    </h4>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location || "Phnom Penh"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                  >
                    {location || "Phnom Penh"}
                  </a>
                  <p className="text-gray-500 text-sm mt-1">
                    Click to view on map
                  </p>
                </div>

                {/* Date Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Booking Date
                    </h4>
                  </div>
                  <p className="text-gray-700 font-medium text-lg">
                    {formatDate(scheduled_date)}
                  </p>
                </div>

                {/* Time Card */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Clock className="text-white" size={20} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      Scheduled Time
                    </h4>
                  </div>
                  <p className="text-gray-700 font-medium text-lg">
                    {scheduled_time
                      ? new Date(
                          `1970-01-01T${scheduled_time}`
                        ).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Time not specified"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <Users className="text-blue-600" size={28} />
                  Assigned Staff
                </h3>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {staffByBooking?.length || 0} staff member
                  {(staffByBooking?.length || 0) !== 1 ? "s" : ""}
                </div>
              </div>

              {staffByBooking && staffByBooking.length > 0 ? (
                <div className="grid gap-4">
                  {staffByBooking.map((staff, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={
                                staff.image ||
                                "/default-avatar.png?height=48&width=48"
                              }
                              alt="Staff"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">
                              {staff.first_name} {staff.last_name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {staff.email}
                            </p>
                            <p className="text-blue-600 text-sm font-medium">
                              {staff.from || "CleanPro Ltd."}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteStaff(index)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200 hover:shadow-md"
                          title="Remove staff"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-gray-100">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    No Staff Assigned
                  </h4>
                  <p className="text-gray-500 mb-6">
                    Add staff members to this booking to get started.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Add First Staff Member
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Users size={28} />
                    Staff Management
                  </h3>
                  <p className="text-blue-100 mt-1">
                    Assign staff members to this booking
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Search Section */}
            <div className="p-6 bg-gray-50 border-b">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search staff by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Staff Grid */}
            <div className="p-6 overflow-y-auto max-h-96">
              {filteredStaffList.length > 0 ? (
                <div className="grid gap-4">
                  {filteredStaffList.map((staff, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:transform hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={
                                staff.image ||
                                "/default-avatar.png?height=48&width=48"
                              }
                              alt="Staff"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {staff.first_name} {staff.last_name}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {staff.email}
                            </p>
                            <p className="text-blue-600 text-sm font-medium">
                              {staff.from || "CleanPro Ltd."}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssignStaff(staff.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    No Staff Found
                  </h4>
                  <p className="text-gray-500">
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
