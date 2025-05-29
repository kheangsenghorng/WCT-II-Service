"use client";

import React, { useEffect, useState } from "react";
import GuestListComponent from "@/components/GuestListComponent";
import { useUserBooking } from "@/store/useUserBooking";
import { useParams } from "next/navigation";

export default function TourDetails() {
  const params = useParams();
  const { id: ownerId, serviesId } = params; // `params` is an object
  console.log("Owner ID:", ownerId);
  console.log("Service ID:", serviesId);

  const {
    bookings,
    loading,
    error,
    fetchBookingsByOwnerId,
    cancelBooking,
    stats,
  } = useUserBooking();

  useEffect(() => {
    fetchBookingsByOwnerId(ownerId);
  }, [ownerId, fetchBookingsByOwnerId]);

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
              <div className="text-sm text-gray-500">Created: May 17, 2025</div>
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
                <div className="text-sm font-medium text-center">2</div>
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
                <div className="text-sm font-medium px-2">$100.00</div>
              </div>
            </div>

            {/* Created Date Section (replacing start and end date) */}
            <div className="mb-4">
              <div className="text-lgfont-bold text-gray-700 font-bold py-1 mb-1">
                Created Date
              </div>
              <div className="text-[16px] text-gray-600">May 17, 2025</div>
            </div>

            <div className="mb-4">
              <div className="text-lg font-bold text-gray-700 mb-1 py-1">
                Description
              </div>
              <div className="text-[16px] text-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
                error culpa et incidunt exercitationem totam perspiciatis sunt
                at dignissimos dolore officiis est, delectus repudiandae quidem,
                laudantium placeat iusto mollitia soluta? Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Repudiandae at excepturi
                sequi quam veritatis rerum repellendus quaerat id mollitia
                molestias architecto deserunt, et neque in quis, culpa
                consequuntur atque fuga! L Modi enim recusandae alias in dolores
                blanditiis adipisci, autem est amet cum aspernatur quo tempora
                quidem minus nobis facilis! Sit, itaque
                et!loadingdfdgfffffffffffffffffghgjh tyut rtytrutyuy ytuyt{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          {/* Right Column */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="text-lg font-bold text-gray-700 mb-2 py-3">
              Tour Gallery
            </div>
            <div className="mb-2">
              <img
                src="https://picsum.photos/id/1015/400/300"
                alt="Tour"
                className="rounded-lg w-full h-64 object-cover mb-2"
              />
            </div>
            <div className="flex space-x-2 mb-4">
              <img
                src="https://picsum.photos/id/1016/150/100"
                alt="Tour"
                className="rounded-lg w-1/3"
              />
              <img
                src="https://picsum.photos/id/1018/150/100"
                alt="Tour"
                className="rounded-lg w-1/3"
              />
              <img
                src="https://picsum.photos/id/1019/150/100"
                alt="Tour"
                className="rounded-lg w-1/3"
              />
            </div>
            <div className="text-sm text-blue-600 text-center">
              View All Photos (4)
            </div>
          </div>
        </div>
        
      </div>

      <GuestListComponent />
    </div>
  );
}
