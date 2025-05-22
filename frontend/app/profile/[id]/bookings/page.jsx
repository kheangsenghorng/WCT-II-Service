"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import { useUserBooking } from "@/store/useUserBooking";
import { ChevronRight } from 'lucide-react'; // Import ChevronRight
// import { log } from "console";

const BookingsPage = () => {
  const { id } = useParams();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useUserBooking();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]); //  Now in the dependency array


  console.log(bookings);
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative min-h-screen">
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent shadow-md" />
          <p className="mt-4 text-green-600 dark:text-green-400 font-medium text-xl">
            Loading...
          </p>
        </div>
      )}

      <motion.div
        className="container mx-auto p-4 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your service bookings.
          </p>
        </section>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-between p-4"
                variants={itemVariants}
              >
                {/* Image */}
                <div className="w-28 h-28 mr-4 rounded-lg overflow-hidden flex-shrink-0">
                  {booking.service?.images?.[0] ? (
                    <Image
                      src={booking.service.images[0]}
                      alt="Service"
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow p-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-1">
                    {booking.serviceName || booking.service?.name || "Unnamed Service"}
                  </h3>
                  <h3 className="text-1xl  text-gray-800 dark:text-gray-300 mb-1">
                    {booking.service?.description || booking.service?.name || "Unnamed Service"}
                  </h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                    <Calendar className="w-4 h-4 mr-1 text-green-600" />
                    <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-1">
                  <Wallet className="w-4 h-4 mr-1 text-green-600" />   
                  {booking.service?.base_price}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center text-gray-500">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center text-gray-500 dark:text-gray-300">
            No bookings found.
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default BookingsPage;