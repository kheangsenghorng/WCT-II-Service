"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  CalendarIcon,
} from "lucide-react";
import { useUserBooking } from "@/store/useUserBooking";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { bookings, fetchBookings } = useUserBooking();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  useEffect(() => {
    fetchBookings(); // Load bookings on mount
  }, [fetchBookings]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getBookingByDay = (day) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, "0");
    const dayStr = day.toString().padStart(2, "0");
    const date = `${year}-${month}-${dayStr}`;

    return bookings.filter((b) => b.scheduled_date === date);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      // Assuming timeString is in format like "14:30:00"
      const [hours, minutes] = timeString.split(":");
      const hour = Number.parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const days = [];
  for (let i = 0; i < getFirstDayOfMonth(currentMonth); i++) {
    days.push(
      <div key={`empty-${i}`} className="p-2 border dark:border-gray-700" />
    );
  }

  for (let i = 1; i <= getDaysInMonth(currentMonth); i++) {
    const dailyBookings = getBookingByDay(i);
    const isToday =
      new Date().getDate() === i &&
      new Date().getMonth() === currentMonth.getMonth() &&
      new Date().getFullYear() === currentMonth.getFullYear();

    days.push(
      <div
        key={i}
        className={cn(
          "p-2 border dark:border-gray-700 h-28 relative overflow-hidden",
          isToday && "bg-blue-50 dark:bg-blue-900/20"
        )}
      >
        <div
          className={cn(
            "font-medium mb-1",
            isToday && "text-blue-600 dark:text-blue-400"
          )}
        >
          {isToday ? (
            <Badge
              variant="outline"
              className="rounded-full px-2 py-0.5 bg-blue-100 dark:bg-blue-800 border-blue-200 dark:border-blue-700"
            >
              {i}
            </Badge>
          ) : (
            <span>{i}</span>
          )}
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[80px] scrollbar-thin">
          {dailyBookings.map((booking, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleBookingClick(booking)}
                    className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-200 
                    rounded-md text-xs truncate border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 
                    dark:hover:bg-indigo-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(booking.scheduled_time)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3" />
                      <span>
                        {booking.first_name || ""} {booking.last_name || ""}
                      </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">
                      {booking.service?.name || "Appointment"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.scheduled_date} at{" "}
                      {formatTime(booking.scheduled_time)}
                    </p>
                    <p className="text-xs">
                      {booking.user?.first_name || "Kheang"}{" "}
                      {booking.user?.last_name || "Senghorng"}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  }

  const goToPreviousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );

  const goToNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousMonth}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
            <span className="mx-3 text-lg font-semibold text-gray-800 dark:text-white">
              {monthName} {year}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-0">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium text-gray-600 dark:text-gray-400 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-850"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View the details of this booking appointment.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className="bg-indigo-100 dark:bg-indigo-800 border-indigo-200 dark:border-indigo-700"
                  >
                    {/* Booking ID: {selectedBooking.id || "N/A"} */}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedBooking.status || "Scheduled"}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                  {selectedBooking.service?.name || "Appointment"}
                </h3>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date & Time
                    </h4>
                    <div className="flex items-center mt-1">
                      <CalendarIcon className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm">
                        {selectedBooking.scheduled_date} at{" "}
                        {formatTime(selectedBooking.scheduled_time)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Client
                    </h4>
                    <div className="flex items-center mt-1">
                      <User className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-sm">
                        {selectedBooking.user?.first_name || "Kheang"}{" "}
                        {selectedBooking.user?.last_name || "Senghorng"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Service Details
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                  {/* <div className="flex justify-between items-center">
                    <span className="font-medium">Service ID:</span>
                    <span>{selectedBooking.service?.id || "N/A"}</span>
                  </div> */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Service Name:</span>
                    <span>{selectedBooking.service?.name || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Location:</span>
                    <span>
                      {selectedBooking.location || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setShowBookingDetails(false)}
            >
              Close
            </Button>
            {/* <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
              >
                Edit
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Manage
              </Button>
            </div> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
