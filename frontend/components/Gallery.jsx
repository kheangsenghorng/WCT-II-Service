"use client";

import { useEffect, useState } from "react";
import { useServicesStore } from "@/store/useServicesStore";

export default function Gallery({ servicesId }) {
  const { fetchServiceById, service, loading, error } = useServicesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (servicesId) {
      fetchServiceById(servicesId);
    }
  }, [fetchServiceById, servicesId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!service) return <div>No service found</div>;

  const images = service.images || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-16">
      {/* Main Image */}
      <div>
        <img
          src={images[0] || "/me.png"}
          alt="Main"
          className="w-full h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-2 gap-2">
        {images.slice(1, 4).map((img, i) => (
          <img
            key={`thumb-${i}`}
            src={img}
            alt={`Photo ${i + 1}`}
            className="h-48 w-full object-cover rounded-lg"
          />
        ))}

        {images.length > 4 && (
          <div className="relative">
            <img
              src={images[4]}
              alt="More"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={handleOpenModal}
              className="absolute inset-0 flex items-center justify-center bg-opacity-50 text-white text-lg font-semibold rounded-lg"
            >
              +{images.length - 4} More Photos
            </button>
          </div>
        )}
      </div>

      {/* Modal for Additional Photos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[80%] max-w-2xl">
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {images.slice(4).map((img, i) => (
                <img
                  key={`modal-${i}`}
                  src={img}
                  alt={`Extra ${i + 5}`}
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
            <button
              onClick={handleCloseModal}
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
