"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your API endpoint to fetch bookings
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/bookings`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) { // Removed ": any"
      // setError(`Error fetching bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      // Replace with your API endpoint to cancel a booking
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Update the bookings list after successful cancellation
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
      alert("Booking cancelled successfully!");  // Replace with a better notification
    } catch (err) { // Removed ": any"
      setError(`Error cancelling booking: ${err.message}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage your service bookings.</p>
      </section>

      {error && <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded mb-4">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading bookings...</div>
      ) : (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-4"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-2">{booking.serviceName}</h3>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{booking.time}</span>
                </div>
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
            ))
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-300">No bookings found.</div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default BookingsPage;