"use client";

import { useState, useEffect } from "react";
import Image from 'next/image'
import Link from "next/link";
import { motion } from "framer-motion";
import { useServicesStore } from "@/store/useServicesStore";
import { ArrowRight } from "lucide-react";

const CARDS_PER_PAGE = 4;

const ServicesSection = () => {
  const { services, loading, error, fetchAllServices } = useServicesStore();
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  const handleViewMore = () => {
    setVisibleCount(services.length);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-600">Loading services...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  // Slice services to show only the visible ones
  const visibleServices = services.slice(0, visibleCount);

  return (
    <div className="py-16 px-8 md:px-20 lg:px-26 md:flex-row">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black dark:text-white">
            We always provide the best service
          </h1>
        </div>
        <div className="text-left mt-8 md:mt-0 lg:ps-40">
          <h2 className="text-3xl font-semibold text-green-500">Services</h2>
          <p className="text-gray-600 dark:text-gray-300">
            While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:
          </p>
        </div>
      </div>

      <section className="py-12 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleServices.map((service) => {
              // Determine image source safely
              const imageSrc =
                Array.isArray(service.images) && service.images.length > 0
                  ? service.images[0]
                  : typeof service.images === "string" && service.images.trim() !== ""
                  ? service.images
                  : "/placeholder.jpg";

              return (
                <motion.div
                key={service.id}
                className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                {/* Image container with rounded top corners */}
                <div className="relative h-56 overflow-hidden rounded-t-xl">
                  <Image
                    src={imageSrc}
                    alt={service.name || "Service Image"}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 ease-in-out hover:scale-110 rounded-t-xl"
                  />
                  {/* Gradient overlay for better readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
              
                {/* Content area */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {service.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-5 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
              
                  {/* Details button */}
                  <Link
                    href={`/services/${service.id}`}
                    className="inline-flex items-center self-start bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 transition-colors duration-300 font-semibold shadow-md hover:shadow-lg"
                  >
                    Details
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
              
              );
            })}
          </div>
          {visibleCount < services.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleViewMore}
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                View More
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;