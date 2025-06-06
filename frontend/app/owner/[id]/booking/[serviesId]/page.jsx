"use client";

import React, { useEffect, useState } from "react";
import GuestListComponent from "@/components/GuestListComponent";
import { useParams } from "next/navigation";
import { useBookingStoreFetch } from "@/store/bookingStore";
import { Tag, Layers } from "lucide-react";

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


  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const images = service?.images || [];
  const mainImage = images[0] || "/default-clean.webp"; // Fallback image if no images are available
  const sideImages = images.slice(1, 4);
  const extraImages = images.slice(4);

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

            <div className="flex space-x-4 mb-4 my-6">
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

              {/* Category */}
              <div className="bg-gray-100 p-3 rounded-lg flex items-start gap-2">
                <Tag className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Category</div>
                  <div className="text-sm font-medium">{service?.category?.name}</div>
                </div>
              </div>

              {/* Type */}
              <div className="bg-gray-100 p-3 rounded-lg flex items-start gap-2">
                <Layers className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="text-sm font-medium">{service?.type?.name}</div>
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

          </div>
        </div>

       
          {/* Right Column */}
           <div className="md:w-1/2 md:pl-4 mt-4 md:mt-0">
      {/* Tour Gallery */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="text-lg font-bold text-gray-700 mb-4">Tour Gallery</div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Image */}
          <div className="relative">
            <img
              src={mainImage}
              alt="Main"
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>

          {/* Side Images */}
          <div className="grid grid-cols-2 gap-2">
            {sideImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Photo ${idx + 1}`}
                className="w-full h-28 object-cover rounded-lg shadow"
              />
            ))}

            {/* +X More Photos overlay */}
            {extraImages.length > 0 && (
              <div className="relative">
                <img
                  src={extraImages[0]}
                  alt="Extra Preview"
                  className="w-full h-28 object-cover rounded-lg shadow"
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="absolute inset-0 flex items-center font-bold text-xl justify-center bg-opacity-50 text-white rounded-lg"
                >
                  +{extraImages.length} More Photos
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Extra Images */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white l rounded-lg p-4 w-[80%] max-w-2xl shadow-xl">
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {extraImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Extra Photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
       


      </div>

      <GuestListComponent />
    </div>
  );
}
