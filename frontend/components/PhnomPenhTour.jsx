"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useServicesStore } from "@/store/useServicesStore";

export default function PhnomPenhTour() {
  const { servicesId } = useParams();
  const { fetchServiceById, service, loading, error } = useServicesStore();

  useEffect(() => {
    if (servicesId) {
      fetchServiceById(servicesId);
    }
  }, [fetchServiceById, servicesId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!service) return <div>No service found</div>;

  // Compute average rating and number of reviews
  // const { averageRating, totalReviews } = useMemo(() => {
  //   const reviews = service.reviews || [];
  //   const total = reviews.length;
  //   const avg =
  //     total > 0
  //       ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total
  //       : 0;
  //   return { averageRating: avg, totalReviews: total };
  // }, [service.reviews]);

  return (
    <div className="min-h-screen w-[800px]">
      {/* Header Section */}
      <header className="text-black py-8">
        <div className="container mx-auto ps-6">
          <Link href="#Explore" id="Explore">
            <h1 className="text-4xl font-bold">{service?.name}</h1>
          </Link>

          {/* <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={`${
                  star <= averageRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto">
        {/* Overview Section */}
        <div className="p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Overview
          </h2>
          <p className="text-gray-600 leading-relaxed">{service.description}</p>
          <p className="text-gray-600 mt-4 italic">
            Read more about - Grand Canyon West, Hoover Dam Stop, and Optional
            Lunch and Skywalk.
          </p>
        </div>

        {/* Itinerary Section (Optional - Uncomment if used) */}
        {/*
        <div className="bg-white p-6 rounded-lg mt-6">
          <Link href="#Explore" id="Itinerary">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Itinerary
            </h2>
          </Link>
          {itinerariesError && (
            <p className="text-red-500">{itinerariesError}</p>
          )}

          {itineraries.length === 0 && !itinerariesError && (
            <p className="text-gray-500">No itineraries available.</p>
          )}

          <div className="border-l-2 border-gray-300 ml-4">
            {itineraries.map((item, index) => {
              const formattedDate = item?.date
                ? new Date(item.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })
                : "";

              return (
                <div
                  key={item._id || index}
                  className="flex items-start mb-8 relative"
                >
                  <div className="w-6 h-6 bg-green-600 text-white flex items-center justify-center rounded-full absolute -left-3">
                    {index + 1}
                  </div>
                  <div className="ml-8 relative">
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                    <h3 className="text-xl font-semibold text-black">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
