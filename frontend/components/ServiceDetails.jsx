"use client";

import { Star } from "lucide-react";
import Link from "next/link";

export default function ServiceDetails({ service }) {
  if (!service) return null;

  const averageRating = service.averageRating || 0;
  const reviewCount = service.reviewCount || 0;

  return (
    <div className="min-h-screen w-full">
      {/* Header Section */}
      <header className="text-black py-8">
        <div className="container mx-auto ps-6">
          <Link href="#Overview">
            <h1 className="text-4xl font-bold">{service.name}</h1>
          </Link>

          <div className="flex items-center mt-2">
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
            <span className="ml-2 text-gray-600">
              {averageRating.toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6">
        {/* Overview Section */}
        <section id="Overview" className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-600 leading-relaxed">{service.description}</p>
        </section>

        {/* Optional Section: Features or Additional Info */}
        {service?.features?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-600">
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {/* If you want to use Itinerary (optional) */}
         {service.itineraries?.length > 0 && (
          <section id="Itinerary" className="bg-white p-6 rounded-lg mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Itinerary</h2>
            <div className="border-l-2 border-gray-300 ml-4">
              {service.itineraries.map((item, index) => (
                <div key={item._id || index} className="flex items-start mb-8 relative">
                  <div className="w-6 h-6 bg-green-600 text-white flex items-center justify-center rounded-full absolute -left-3">
                    {index + 1}
                  </div>
                  <div className="ml-8 relative">
                    <p className="text-sm text-gray-500">{item.date}</p>
                    <h3 className="text-xl font-semibold text-black">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} 
      </div>
    </div>
  );
}
