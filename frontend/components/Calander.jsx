"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"; // Import icons

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2 border"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      <div key={i} className="p-2 border">
        {i}
        {i === 12 && (
          <div className="mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-md text-xs">
            Total Amount
          </div>
        )}
        {i === 10 && (
          <div className="mt-1 px-2 py-1 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 rounded-md text-xs">
            Total Sales
          </div>
        )}
        {i === 7 && (
          <div className="mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-md text-xs">
            Total Amount
          </div>
        )}
        {i === 22 && (
          <div className="mt-1 px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 rounded-md text-xs">
            New Sales
          </div>
        )}
        {i === 29 && (
          <div className="mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-md text-xs">
            Total Amount
          </div>
        )}
        {i === 8 && (
          <div className="mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-md text-xs">
            Total Amount
          </div>
        )}
        {i === 23 && (
          <div className="mt-1 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-md text-xs">
            Total Amount
          </div>
        )}
      </div>
    );
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        {/* Month Navigation */}
        <div className="flex items-center">
          <button
            onClick={goToPreviousMonth}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <span className="mx-3 text-lg font-semibold text-gray-800 dark:text-white">
            {monthName} {year}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Add Event Button */}
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="p-2 text-center font-medium text-gray-600 dark:text-gray-400 border-b dark:border-gray-700"
          >
            {dayName}
          </div>
        ))}
        {days.map((day) => day)}
      </div>
    </div>
  );
};

export default Calendar;
