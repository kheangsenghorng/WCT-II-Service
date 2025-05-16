"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";

const ServicesSection = () => {
  // Zustand store selectors
  const {
    services,
    loading,
    error,
    fetchAllServices,
  } = useServicesStore((state) => ({
    services: state.services,
    loading: state.loading,
    error: state.error,
    fetchAllServices: state.fetchAllServices,
  }));

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <div className="flex mb-12 space-x-20 px-5">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              We Always Provide The Best Cleaning Service
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-xl font-semibold text-gray-800 mb-2">Services</p>
            <p className="text-gray-600 leading-relaxed">
              We can customize your cleaning plan to suit your needs. Most clients
              schedule regular cleaning services to maintain a pristine home.
            </p>
          </div>
        </div>

        {/* Loading and Error */}
        {loading && (
          <p className="text-center text-gray-500">Loading services...</p>
        )}
        {error && (
          <p className="text-center text-red-500">Error: {error}</p>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && services.length === 0 && (
            <p className="col-span-3 text-center text-gray-500">
              No services found.
            </p>
          )}

          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <Image
                  src={service.image || "/default-service.jpg"}
                  alt={service.title}
                  width={800} // Increased for higher resolution
                  height={500} // Increased for higher resolution
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
              </div>
              <div className="p-6 relative">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <Link
                  href={`/services/${service.id}`}
                  className="bg-green-500 text-white py-2 px-4 rounded-md inline-flex items-center hover:bg-green-600 transition-colors duration-200 absolute bottom-4 right-4"
                >
                  Book Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;