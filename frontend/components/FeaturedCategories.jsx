"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Star, MapPin, Info, Wallet, Clock, ChevronRight } from "lucide-react";

import { useCategoryStore } from "@/store/categoryStore";
import { useServicesStore } from "@/store/useServicesStore";
import { useTypeStore } from "@/store/useTypeStore";

const FeaturedCategories = () => {
  const { id } = useParams(); // Assuming you're using Next.js or similar routing
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const { services, fetchAllServices } = useServicesStore();
  const { types, fetchTypes } = useTypeStore();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchAllServices();
    fetchTypes();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  const filteredCategory = categories.find((c) => c.slug === selectedCategory);

  const filteredTypes = selectedCategory
    ? types.filter((t) => t.service_categories_id === filteredCategory?.id)
    : types; // show all types when no category selected

  const filteredServices = services.filter((service) => {
    const matchCategory =
      !selectedCategory ||
      service.service_categories_id === filteredCategory?.id;
    const matchType = !selectedType || service.type_id === selectedType;
    return matchCategory && matchType;
  });

  // const filteredCategory = categories.find((c) => c.slug === selectedCategory);

  // const filteredTypes = selectedCategory
  //   ? types.filter((t) => t.service_categories_id === filteredCategory?.id)
  //   : types;

  // const filteredServices = services.filter((service) => {
  //   const matchCategory =
  //     !selectedCategory || service.service_categories_id === filteredCategory?.id;
  //   const matchType = !selectedType || service.type_id === selectedType;
  //   return matchCategory && matchType;
  // });

  const filteredCategories = selectedCategory
    ? categories.filter((category) => category.slug === selectedCategory)
    : categories;

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="animate-pulse text-center text-gray-400">
          Loading...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="bg-red-100 text-red-700 p-6 rounded-xl text-center">
          Error loading data: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-8xl mx-auto px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
          <span className="text-emerald-700 text-sm font-semibold uppercase">
            Service Categories
          </span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Our
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent ml-3">
            Featured Categories
          </span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover a wide range of services tailored to meet your needs
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedType(null);
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            selectedCategory === null
              ? "bg-emerald-600 text-white"
              : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-50"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              const isSelected = selectedCategory === category.slug;
              setSelectedCategory(isSelected ? null : category.slug);
              setSelectedType(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selectedCategory === category.slug
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-50"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      {selectedCategory && (
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selectedType === null
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-teal-50"
            }`}
          >
            All Types
          </button>
          {filteredTypes.map((type) => (
            <button
              key={type.id}
              onClick={() =>
                setSelectedType((prev) => (prev === type.id ? null : type.id))
              }
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                selectedType === type.id
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-teal-50"
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => {
            const imageSrc =
              Array.isArray(service.images) && service.images.length > 0
                ? service.images[0]
                : typeof service.images === "string" &&
                  service.images.trim() !== ""
                ? service.images
                : "/placeholder.jpg";

            const userId = service.user_id || null;
            const link = userId
              ? `/user/${userId}/details/${service.id}`
              : `/details/${service.id}`;

            return (
              <motion.div
                key={service.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                {/* Image Section */}
                <div className="relative w-full h-55">
                  <Image
                    src={imageSrc || "/placeholder.svg"}
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

                    {/* Rating (if available) */}
                    {service.rating && (
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          {service.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-3">
                    {service.location && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{service.location}</span>
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

                    {/* Price Badge */}
                    {service.base_price && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Wallet className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {" "}
                          ${service.base_price}
                        </span>
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
                          {" "}
                          Time{" "}
                          {new Date(service.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
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
      ) : (
        <p className="text-center text-gray-500 mt-12">
          No services found for this category.
        </p>
      )}
    </section>
  );
};

export default FeaturedCategories;
