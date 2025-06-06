"use client";

import { useEffect, useState } from "react";
import { useBookingStoreFetch } from "../store/bookingStore";
import { X, ImageIcon, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ userId }) {
  const { booking, loading, error, fetchBookingById } = useBookingStoreFetch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchBookingById(userId); // Here, `userId` is treated as the booking ID
    }
  }, [userId, fetchBookingById]);

  if (loading) {
    return (
      <div className="container rounded-2xl mx-auto p-6 w-[700px] my-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main image skeleton */}
              <div className="w-full h-80 bg-gray-300 rounded-xl"></div>
              {/* Side images skeleton */}
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full h-36 bg-gray-300 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container rounded-2xl mx-auto p-6 w-[700px] my-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <ImageIcon className="mx-auto text-red-400 mb-4" size={48} />
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to Load Gallery
          </div>
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!booking || !booking.service) {
    return (
      <div className="container rounded-2xl mx-auto p-6 w-[700px] my-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
          <ImageIcon className="mx-auto text-yellow-400 mb-4" size={48} />
          <div className="text-yellow-600 text-lg font-semibold mb-2">
            No Gallery Found
          </div>
          <div className="text-yellow-500">
            The service gallery is not available.
          </div>
        </div>
      </div>
    );
  }

  const images = booking.service.images || [];

  if (images.length === 0) {
    return (
      <div className="container rounded-2xl mx-auto p-6 w-[700px] my-8">
        <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Images Available
          </h3>
          <p className="text-gray-500">
            This service doesn't have any photos yet.
          </p>
        </div>
      </div>
    );
  }

  const mainImage = images[0];
  const sideImages = images.slice(1, 5); // First 4 side images
  const extraImages = images.slice(5); // Remaining go in modal

  const openModal = (index = 0) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container rounded-2xl mx-auto p-4 w-[600px] my-5">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Gallery Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div className="relative group">
              <img
                src={mainImage || "/placeholder.svg"}
                alt="Main Photo"
                className="w-full h-80 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => openModal(0)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn className="text-gray-700" size={24} />
                </div>
              </div>
            </div>

            {/* Side Images */}
            <div className="grid grid-cols-2 gap-3">
              {sideImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Photo ${index + 2}`}
                    className="w-full h-36 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => openModal(index + 1)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="text-gray-700" size={16} />
                    </div>
                  </div>
                </div>
              ))}

              {/* + More Photos button if extra images exist */}
              {extraImages.length > 0 && sideImages.length < 4 && (
                <div className="relative group">
                  <img
                    src={extraImages[0] || "/placeholder.svg"}
                    alt="More Photos Preview"
                    className="w-full h-36 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => openModal(5)}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center text-white rounded-lg transition-all duration-300 hover:from-black/90 hover:via-black/50"
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">
                        +{extraImages.length}
                      </div>
                      <div className="text-sm font-medium">More Photos</div>
                    </div>
                  </button>
                </div>
              )}

              {/* View All Button if we have exactly 4 side images */}
              {sideImages.length === 4 && extraImages.length > 0 && (
                <button
                  onClick={() => openModal(0)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1">
                      +{extraImages.length}
                    </div>
                    <div className="text-xs font-medium">View All</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Image Viewing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ImageIcon size={24} />
                <div>
                  <h3 className="text-lg font-bold">Gallery Viewer</h3>
                  <p className="text-blue-100 text-sm">
                    {selectedImageIndex + 1} of {images.length}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Image Display */}
            <div className="relative bg-gray-100">
              <img
                src={images[selectedImageIndex] || "/placeholder.svg"}
                alt={`Gallery Image ${selectedImageIndex + 1}`}
                className="w-full h-96 object-contain"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-blue-500 shadow-lg scale-110"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
