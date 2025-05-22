"use client";

import { useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";

export default function Gallery({ userId }) {
  const { booking, loading, error, fetchBookingById } = useBookingStoreFetch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchBookingById(userId); // Here, `userId` is treated as the booking ID
    }
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!booking || !booking.service) return <div>No booking found.</div>;

  const images = booking.service.images || [];
  const mainImage = images[0];
  const sideImages = images.slice(1, 4); // First 3 side images
  const extraImages = images.slice(4); // Remaining go in modal

  return (
    <div className="container rounded-xl mx-auto p-4 w-[600px]">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Image */}
        <div className="relative">
          <img
            src={mainImage}
            alt="Main Photo"
            className="w-full h-102 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Side Images */}
        <div className="grid grid-cols-2 gap-2">
          {sideImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Photo ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          ))}

          {/* + More Photos button if extra images exist */}
          {extraImages.length > 0 && (
            <div className="relative">
              <img
                src={extraImages[0]}
                alt="Extra Preview"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 flex items-center justify-center bg-opacity-60 text-white text-lg font-semibold rounded-lg"
              >
                +{extraImages.length} More Photos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Additional Photos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[80%] max-w-2xl shadow-xl">
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {extraImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Modal Photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
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
  );
}
