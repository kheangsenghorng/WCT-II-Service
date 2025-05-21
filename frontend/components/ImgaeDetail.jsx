"use client";

import { useState } from "react";

export default function Gallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container  rounded-xl mx-auto p-4 w-[600px]">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Image */}
        <div className="relative">  
          <img
            src="1.jpg"
            alt="Main Photo"
            className="w-full h-102 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Side Images */}
        <div className="grid grid-cols-2 gap-2">
          <img
            src="2.jpg"
            alt="Photo 1"
            className="w-full h-50 object-cover rounded-lg shadow-md"
          />
          <img
            src="3.jpg"
            alt="Photo 2"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <img
            src="4.jpg"
            alt="Photo 3"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <div className="relative">
            <img
              src="4.jpg"
              alt="Photo 4"
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
            {/* Button for More Photos */}
            <button
              onClick={handleOpenModal}
              className="absolute inset-0 flex items-center justify-center bg-gray-400 bg-opacity-50 text-white text-lg font-semibold rounded-lg"
            >
              +2 More Photos
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Additional Photos */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-[80%] max-w-2xl">
            {/* Scrollable container */}
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              <img
                src="1.jpg"
                alt="Photo 1"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <img
                src="2.jpg"
                alt="Photo 2"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <img
                src="3.jpg"
                alt="Photo 3"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <img
                src="4.jpg"
                alt="Photo 4"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <img
                src="2.jpg"
                alt="Photo 2"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
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
