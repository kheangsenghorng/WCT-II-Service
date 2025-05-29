"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import DateTimeSelector from "./DateTimeSelector";
import { useBookingStoreFetch } from "@/store/bookingStore";

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const servicesId = params?.servicesId;
  const userId = params?.id;

  const { fetchBookedSlots, bookedSlots } = useBookingStoreFetch();

  useEffect(() => {
    if (servicesId && selectedDate) {
      fetchBookedSlots(servicesId, selectedDate);
      setSelectedTime(""); // Reset time when date changes
    }
  }, [servicesId, selectedDate, fetchBookedSlots]);

  const handleDateTimeChange = (date, time) => {
    if (date) setSelectedDate(date);
    if (time) setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!userId) return router.push("/login");
    if (!servicesId || !selectedDate || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }

    setLoading(true);
    const queryParams = new URLSearchParams({
      userId,
      servicesId,
      date: selectedDate,
      time: selectedTime,
    }).toString();

    router.push(`/user/${userId}/Payment/?${queryParams}`);
  };

  return (
    <motion.div
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-emerald-600 dark:bg-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Book Your Tour</h2>
          <p className="text-emerald-100 mt-2">
            Complete the form below to secure your reservation
          </p>
        </div>

        <div className="p-6 space-y-8">
          <DateTimeSelector
            onDateTimeChange={handleDateTimeChange}
            bookedSlots={bookedSlots}
          />

          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {selectedTime}
                </span>
              </div>
            </motion.div>
          )}

          <motion.button
            onClick={handleBooking}
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-800 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingForm;
