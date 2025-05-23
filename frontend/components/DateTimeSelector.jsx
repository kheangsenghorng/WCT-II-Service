import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Check } from "lucide-react";

const DateTimeSelector = ({ onDateTimeChange }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isTimeSlotsVisible, setIsTimeSlotsVisible] = useState(false);

  const timeSlots = useMemo(() => {
    const startTime = 6.5; // 6:30 AM
    const endTime = 18; // 6:00 PM
    const interval = 0.5; // 30 minutes interval
    const slots = [];

    for (let i = startTime; i <= endTime; i += interval) {
      const hours = Math.floor(i);
      const minutes = (i % 1) * 60;
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      const displayTime = `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
      slots.push({ value: timeString, display: displayTime });
    }
    return slots;
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(""); // Clear selected time when date changes
    setIsTimeSlotsVisible(true); // Show time slots when date is selected
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    onDateTimeChange(selectedDate, time); // Call the parent component's callback
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="space-y-6">
      {/* Date Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <label
          htmlFor="date"
          className="block font-medium mb-2 text-gray-800 dark:text-gray-200 flex items-center gap-2"
        >
          <CalendarDays className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Select Date</span>
          <span className="text-emerald-600 dark:text-emerald-400">*</span>
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
          required
        />
      </motion.div>

      {/* Time Slots */}
      {isTimeSlotsVisible && (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <label className="block font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Select Time</span>
            <span className="text-emerald-600 dark:text-emerald-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <motion.button
                key={slot.value}
                onClick={() => handleTimeSelect(slot.value)}
                className={`relative px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2
                  ${
                    selectedTime === slot.value
                      ? "bg-emerald-500 border-emerald-600 text-white shadow-md hover:bg-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 dark:hover:bg-emerald-700"
                      : "bg-white border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:bg-gray-700"
                  }`}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedTime === slot.value && <Check className="absolute top-1 right-1 w-3 h-3 text-white" />}
                {slot.display}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DateTimeSelector;
