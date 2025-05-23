"use client";
import { useEffect, useState } from "react";
import { useUserBooking } from "@/store/useUserBooking";
import { Calendar, CreditCard, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function AllBookingsPage() {
  const params = useParams();
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

  useEffect(() => {
    fetchBookingsByOwnerId(ownerId);
  }, [ownerId, fetchBookingsByOwnerId]);

  console.log(bookings);

  const handleConfirmCancel = (id) => {
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

  if (loading)
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-pulse text-lg">Loading bookings...</div>
      </div>
    );

  if (error)
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );

  if (!bookings || bookings.length === 0) {
    return (
      <div className="w-full p-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          No bookings found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl font-bold">
            All Users Bookings List
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y dark:divide-gray-700">
              <thead className="dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
                <tr>
                  {[
                    "ID",
                    "Images",
                    "Name",
                    "Price",
                    "Scheduled Date",
                    "Category",
                    "Type",
                    "total Price",
                    "Total Guests",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 text-gray-700">{index + 1}</td>
                    <td className="p-3">
                      <img
                        src={booking.service?.images?.[0] || "/placeholder.png"}
                        alt={booking.service?.name || "Service Image"}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="p-3 text-gray-700 font-medium">
                      {booking.service?.name || "Unknown Service"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          {booking.service?.base_price || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          {formatDate(booking?.scheduled_date)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {booking.service?.category ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            booking.service.category.name
                          )}`}
                        >
                          <Tag className="h-3 w-3" />
                          {booking.service.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {booking.service?.type ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            booking.service.type.name
                          )}`}
                        >
                          <Tag className="h-3 w-3" />
                          {booking.service.type.name}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-700 font-medium">
                      ${Number(booking?.service_total_price).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-700 font-medium">
                      {booking?.service_booking_count || "Unknown Service"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          {booking?.status || "Nothing"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleConfirmCancel(booking.id)}
                        className="text-red-500 font-bold py-2 rounded inline-flex items-center"
                      >
                        <Trash2 className="w-8" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {bookings.length} booking
            {bookings.length !== 1 ? "s" : ""}
          </div>
        </CardContent>
      </Card>

      {showConfirm && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Cancel Booking
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
