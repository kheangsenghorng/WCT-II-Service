"use client";

import React, { useEffect, useState } from "react";
import GuestListComponent from "@/components/GuestListComponent";
import { useParams } from "next/navigation";
import { useBookingStoreFetch } from "@/store/bookingStore";

export default function TourDetails() {
  const params = useParams();
  const { id: ownerId, serviesId } = params; // `params` is an object
  const serviceId = params?.serviceId || params?.serviesId; // fallback for typo

  const { fetchServiceBookings, service, stats, userBookings, loading, error } =
    useBookingStoreFetch();

  useEffect(() => {
    if (ownerId && serviceId) {
      fetchServiceBookings(ownerId, serviceId);
    }
  }, [ownerId, serviceId]);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      <div className="flex justify-between items-stretch mb-4">
        <div className="w-1/2 pr-4">
          {/* Left Column */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">
                <span className="mr-2">
                  <svg
                    className="inline-block w-4 h-4 mr-1 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 110-4h10a2 2 0 110 4H7z"
                    ></path>
                  </svg>
                  ID: TTHH3
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Created: {formatDate(service?.created_at)}
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-600">
                  <svg
                    className="inline-block w-4 h-4 mr-1 text-green-600 text-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197H9v-1a6 6 0 0112 0v1zm0 0V5.646a4.5 4.5 0 10-9 0V21h6z"
                    ></path>
                  </svg>
                  Bookings
                </div>
                <div className="text-sm font-medium text-center">
                  {stats?.total_booking_count}
                </div>
              </div>

              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-600">
                  <svg
                    className="inline-block w-4 h-4 mr-1  text-green-600 text-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Price
                </div>
                <div className="text-sm font-medium px-2">
                  ${stats?.total_base_price}
                </div>
              </div>
            </div>

            {/* Created Date Section (replacing start and end date) */}
            <div className="mb-4">
              <div className="text-lgfont-bold text-gray-700 font-bold py-1 mb-1">
                Created Date
              </div>
              <div className="text-[16px] text-gray-600">
                {" "}
                {formatDate(service?.created_at)}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-lg font-bold text-gray-700 mb-1 py-1">
                Description
              </div>
              <div className="text-[16px] text-gray-600">
                {service?.description}{" "}
              </div>
            </div>
            <div className="mb-4">
              <div className="text-lg font-bold text-gray-700 mb-1 py-1">
                category
              </div>
              <div className="text-[16px] text-gray-600">
                {service?.category?.name}{" "}
                <img
                  src={
                    service?.category?.image ||
                    "https://picsum.photos/id/1019/150/100"
                  }
                  alt="Tour"
                  className="rounded-lg w-1/3"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="text-lg font-bold text-gray-700 mb-1 py-1">
                type
              </div>
              <div className="text-[16px] text-gray-600">
                {service?.type?.name}{" "}
                <img
                  src={
                    service?.type?.image_url ||
                    "https://picsum.photos/id/1019/150/100"
                  }
                  alt="Tour"
                  className="rounded-lg w-1/3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 md:pl-4 mt-4 md:mt-0">
          {/* Right Column */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="text-lg font-bold text-gray-700 mb-2 py-3">
              Tour Gallery
            </div>

            {/* Main Image */}
            <div className="mb-2">
              <img
                src={
                  service?.images?.[0] ||
                  "https://picsum.photos/id/1015/400/300"
                }
                alt="Main"
                className="rounded-lg w-full h-64 object-cover mb-2"
              />
            </div>

            {/* Thumbnail images */}
            <div className="flex space-x-2 mb-4">
              {(service?.images?.slice(1, 4) ?? []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  className="rounded-lg w-1/3 h-[100px] object-cover"
                />
              ))}
            </div>

            <div className="text-sm text-blue-600 text-center cursor-pointer">
              View All Photos ({service?.images?.length ?? 0})
            </div>
          </div>
        </div>
      </div>

      <GuestListComponent />
    </div>
  );
}
