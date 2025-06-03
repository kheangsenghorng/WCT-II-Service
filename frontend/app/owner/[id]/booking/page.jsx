"use client";
import { useEffect, useState } from "react";
import { useUserBooking } from "@/store/useUserBooking";
import { Calendar, CreditCard, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function AllBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const ownerId = params?.id;

  const {
    bookings,
    loading,
    error,
    fetchBookingsByOwnerId,
    cancelBooking,
    stats,
  } = useUserBooking();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table"); // Default view mode
  // const [viewMode, setViewMode] = useState("cards"); // Uncomment this line to default to cards view
 

  useEffect(() => {
    fetchBookingsByOwnerId(ownerId);
  }, [ownerId, fetchBookingsByOwnerId]);

  const handleConfirmCancel = (e, id) => {
    e.stopPropagation(); // Prevent row click when clicking delete button
    setSelectedBookingId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedBookingId) {
      cancelBooking(selectedBookingId);
      setShowConfirm(false);
      setSelectedBookingId(null);
    }
  };

  const handleRowClick = (booking) => {
    if (booking.service?.id) {
      router.push(`/owner/${ownerId}/booking/${booking.service.id}`);
    }
  };

  const getCategoryColor = (name) => {
    if (!name) return "bg-gray-100 text-gray-800";
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
    ];
    const index = Math.abs(name.charCodeAt(0) % colors.length);
    return colors[index];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 animate-pulse"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <h3 className="font-semibold mb-2">Error Loading booking...</h3>
            <p>{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking) =>
    booking.service?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="w-full p-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold">
            All Users Bookings List
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Click on any row to view booking details
          </p>
        </CardHeader>

        <CardContent>
          {/* Search Bar */}
          <div className="flex justify-end mb-4">
            <div className="relative w-full max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search by service name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border rounded-md w-full text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y dark:divide-gray-700">
              <thead className="dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
                <tr>
                  {[
                    "ID",
                    "Images",
                    "Name",
                    "Price",
                    "Scheduled",
                    "Category",
                    "Type",
                    "Total Price",
                    "Total Guests",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-2 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide uppercase whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(booking)}
                    className="border-b border-gray-100 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
                  >
                    <td className="px-2 py-1 text-[14px] text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="p-3">
                      <div className="relative overflow-hidden rounded-md group-hover:scale-105 transition-transform duration-200">
                        <img
                          src={
                            booking.service?.images?.[0] || "/default-avatar.png"
                          }
                          alt={booking.service?.name || "Service Image"}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {booking.service?.name || "Unknown Service"}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors duration-200" />
                        <span className="text-gray-700 dark:text-gray-300">
                          ${booking.service?.base_price || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors duration-200" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {formatDate(booking?.scheduled_date)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {booking.service?.category ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            booking.service.category.name
                          )} group-hover:shadow-md transition-shadow duration-200`}
                        >
                          <Tag className="h-3 w-3" />
                          {booking.service.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {booking.service?.type ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            booking.service.type.name
                          )} group-hover:shadow-md transition-shadow duration-200`}
                        >
                          <Tag className="h-3 w-3" />
                          {booking.service.type.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                      <span className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                        ${Number(booking?.service_total_price).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                      <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                        {booking?.service_booking_count || "0"}
                      </span>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={(e) => handleConfirmCancel(e, booking.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-2 px-2 rounded-md inline-flex items-center transition-all duration-200 hover:scale-110"
                        title="Cancel booking"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredBookings.length} booking
            {filteredBookings.length !== 1 ? "s" : ""} of {bookings.length}{" "}
            total
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Cancel Booking
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to cancel this booking? This action cannot
              be undone and may affect the customer's plans.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
              >
                Keep Booking
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
