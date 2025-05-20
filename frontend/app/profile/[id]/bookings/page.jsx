"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useUserBooking } from "@/store/useUserBooking";

const BookingsPage = () => {
  const { id } = useParams();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useUserBooking();

  useEffect(() => {
    fetchBookings();
  }, []); // No need to add fetchBookings in deps unless it's memoized

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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-4"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  {booking.serviceName || booking.service?.name || "Unnamed Service"}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{booking.scheduled_time || "Not scheduled"}</span>
                </div>

                {booking.service?.images?.[0] && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <Image
                      src={booking.service.images[0]}
                      alt="Service image"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  {booking.status === "Confirmed" ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>Confirmed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      <span>{booking.status}</span>
                    </>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                  >
                    Cancel
                  </button>
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
