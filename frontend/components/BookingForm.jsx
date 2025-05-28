"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import DateTimeSelector from "./DateTimeSelector";

const BookingForm = () => {
  const [sit, setSit] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isGuestsDropdownOpen, setIsGuestsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  const servicesId = params?.servicesId;
  const userId = params?.id;

  // Note: Removed type annotations for JSX compatibility
  const handleDateTimeChange = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    console.log(`Selected date: ${date}, selected time: ${time}`);
  };

  const handleBooking = () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    if (!servicesId) {
      console.warn("No service ID provided.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }

    setLoading(true);

    const queryParams = new URLSearchParams({
      userId: userId,
      servicesId: servicesId,
      date: selectedDate,
      time: selectedTime,
    }).toString();

    router.push(`/user/${userId}/Payment/?${queryParams}`);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 dark:bg-emerald-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Book Your Tour</h2>
          <p className="text-emerald-100 mt-2">
            Complete the form below to secure your reservation
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleBooking();
          }}
          className="p-6 space-y-8"
        >
          {/* Date and Time Selection */}
          <DateTimeSelector onDateTimeChange={handleDateTimeChange} />

          {/* Selected Date & Time Summary (if both are selected) */}
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

          {/* Sit Dropdown */}
          {/* <div className="relative">
            <label
              htmlFor="sit"
              className="block font-medium mb-2 text-gray-800 dark:text-gray-200 flex items-center gap-2"
            >
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Number of Seats</span>
              <span className="text-emerald-600 dark:text-emerald-400">*</span>
            </label>
            <motion.button
              type="button"
              onClick={() => setIsGuestsDropdownOpen(!isGuestsDropdownOpen)}
              className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="font-medium">
                {sit} {sit === 1 ? "Seat" : "Seats"}
              </span>
              {isGuestsDropdownOpen ? (
                <ChevronUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              )}
            </motion.button>

            <AnimatePresence>
              {isGuestsDropdownOpen && (
                <motion.div
                  className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Guests</span>
                      <div className="flex items-center gap-4">
                        <motion.button
                          type="button"
                          onClick={() => setSit(Math.max(1, sit - 1))}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={sit <= 1}
                        >
                          -
                        </motion.button>
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200 w-6 text-center">
                          {sit}
                        </span>
                        <motion.button
                          type="button"
                          onClick={() => setSit(sit + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      onClick={() => setIsGuestsDropdownOpen(false)}
                      className="w-full mt-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Confirm
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}

          {/* Submit Button */}
          <motion.button
            type="submit"
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
        </form>
      </div>
    </motion.div>
  );
};

export default BookingForm;
