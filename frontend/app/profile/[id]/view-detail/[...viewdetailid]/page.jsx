"use client";

import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import StaffProvider from "@/components/StaffProvider";
import { useBookingStoreFetch } from "@/store/bookingStore";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";


export default function ViewDetail() {
  const { id, viewdetailid } = useParams();
  const router = useRouter();

  // Extract userId and serviceId from URL params
  const userId = id;
  const serviceId = viewdetailid?.[0] || null;
  const bookingId = viewdetailid?.[1] || null;

  const { booking, loading, error, fetchBookingDetail } =
    useBookingStoreFetch();

  useEffect(() => {
    if (userId && serviceId && bookingId) {
      fetchBookingDetail(userId, serviceId, bookingId);
    }
  }, [userId, serviceId, bookingId]);



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title & Back */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">
          {booking?.service?.name || "Service Name"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Image + Info */}
        <div className="col-span-2 flex flex-col">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="text-lg font-bold text-gray-700 mb-4">
              Tour Gallery
            </div>
            <img
              src={
                booking?.service?.images?.[0] ||
                "https://picsum.photos/id/1015/800/450"
              }
              alt="Tour"
              className="rounded-lg w-full h-[260px] object-cover mb-4"
            />
            <div className="flex flex-wrap gap-2 mb-4 pe-4">
              {booking?.service?.images?.slice(1, 4).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Tour ${index}`}
                  className="rounded-lg w-1/3 aspect-video object-cover flex-shrink-0"
                />
              ))}
            </div>
            <div className="text-sm text-blue-600 text-center mt-2 cursor-pointer">
              View All Photos ({booking?.service?.images?.length || 0})
            </div>
          </div>
        </div>

        {/* Right Side: Booking Summary */}
        <div className="bg-white px-6 pt-3 pb-1 rounded-xl shadow-lg w-full max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2 text-indigo-700 py-3">
            Booking Summary
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Your service package details
          </p>

          <div className="space-y-1">
            {/* Provider */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
              <div className="flex items-center space-x-2">
                <User className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Provider:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {booking?.user?.name || "N/A"}
              </span>
            </div>

            {/* Create Date */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
              <div className="flex items-center space-x-2">
                <Calendar className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Create Date:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {new Date(booking?.service?.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </span>
            </div>

            {/* Booking Date */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
              <div className="flex items-center space-x-2">
                <Calendar className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Booking Date:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {new Date(booking?.scheduled_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Time Booking */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
              <div className="flex items-center space-x-2">
                <Clock className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">Time Booking:</span>
              </div>
              <span className="font-semibold text-gray-900">
                {new Date(
                  `1970-01-01T${booking?.scheduled_time}`
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 cursor-default transition">
              <div className="flex items-center space-x-2">
                <MapPin className="text-indigo-400" size={20} />
                <span className="text-gray-700 font-medium">
                  Your Location:
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                {booking?.location || "N/A"}
              </span>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between p-2 rounded-md font-bold text-lg text-indigo-700 cursor-default">
              <div className="flex items-center space-x-2">
                <CheckCircle size={22} />
                <span>Total Price:</span>
              </div>
              <span>${booking?.service?.base_price || "0.00"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* StaffProvider */}
      <div className="mt-8">
        <StaffProvider />
      </div>
    </div>
  );
}
