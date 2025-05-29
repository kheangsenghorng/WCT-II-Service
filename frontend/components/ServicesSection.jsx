"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useServicesStore } from "@/store/useServicesStore";
import { Star, MapPin, Clock, ChevronRight, Wallet, Info } from "lucide-react";
import { useParams } from "next/navigation";

const CARDS_PER_PAGE = 4;

const ServicesSection = ({ selectedCategorySlug }) => {
  const { id } = useParams();
  const { services, loading, error, fetchAllServices } = useServicesStore();
  const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  const filteredServices = selectedCategorySlug
    ? services.filter((s) => s.categorySlug === selectedCategorySlug)
    : services;

  const visibleServices = filteredServices.slice(0, 4); // Always only show first 4

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">Loading services...</div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">Error: {error}</div>;
  }

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
            While we can customize your cleaning plan to suit your needs, most
            clients schedule regular cleaning services:
          </p>
        </div>
      </div>

      <section className="py-12 dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleServices.map((service) => {
              const imageSrc =
                Array.isArray(service.images) && service.images.length > 0
                  ? service.images[0]
                  : typeof service.images === "string" &&
                    service.images.trim() !== ""
                  ? service.images
                  : "/placeholder.jpg";

              return (
                <motion.div
                  key={service.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                >
                  <div className="relative w-full h-55">
                    <Image
                      src={imageSrc}
                      alt={service.name || "Service"}
                      fill
                      sizes="(max-width: 768px) 100vw, 800px"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                        {service.name || "Unnamed Service"}
                      </h3>

                      {service.rating && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">
                            {service.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-3">
                      {service.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {service.location}
                          </span>
                        </div>
                      )}

                      {service.description && (
                        <div className="flex items-center">
                          <Info className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="line-clamp-2">
                            {service.description}
                          </span>
                        </div>
                      )}

                      {service.base_price && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <Wallet className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>${service.base_price}</span>
                        </div>
                      )}

                      {service.duration && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{service.duration}</span>
                        </div>
                      )}

                      {service.created_at && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>
                            Time{" "}
                            {new Date(service.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={
                        id
                          ? `/user/${id}/details/${service.id}`
                          : `/details/${service.id}`
                      }
                      className="w-full block"
                    >
                      <div className="flex justify-end items-center mt-2">
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Link to full services page */}
          {filteredServices.length > 4 && (
            <div className="text-center mt-8">
              <Link
                href={ 
                  id ? `/user/${id}/service` : `/service`}
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors duration-200 inline-block"
              >
                View More Services
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
