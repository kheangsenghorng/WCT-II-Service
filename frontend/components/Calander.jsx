"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  CalendarIcon,
  MapPin,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";

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
} from "@/components/ui/dialog";
import { useBookingStoreFetch } from "@/store/bookingStore";
import { useParams } from "next/navigation";

const Calendar = () => {
  const { id } = useParams();
  const ownerId = id; // Assuming ownerId is passed as a prop or derived from context
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { bookings, fetchBookingsByOwner, loading, error } =
    useBookingStoreFetch();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  useEffect(() => {
    fetchBookingsByOwner(ownerId);
  }, [ownerId]);

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

      {/* Enhanced Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="sm:max-w-lg h-[85vh] max-h-[85vh] flex flex-col">
          <DialogHeader className="text-center pb-2 flex-shrink-0">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Booking Confirmed! ✨
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Here are all the wonderful details for your upcoming appointment
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-1 -mx-1 min-h-0">
            {selectedBooking && (
              <div className="space-y-6 py-4">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {selectedBooking.status || "Confirmed"}
                  </Badge>
                </div>

                {/* Main Service Card */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                        {selectedBooking.service?.name || "Appointment"}
                      </h3>
                      <div className="flex items-center text-green-700 dark:text-green-300">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        <span className="text-sm font-medium">
                          Premium Service
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {selectedBooking.service?.base_price || "$120"}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {selectedBooking.scheduled_time || "90 minutes"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Date & Time */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                        <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Date & Time
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          When you'll be pampered
                        </p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedBooking.scheduled_date}
                      </p>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatTime(selectedBooking.scheduled_time)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        Duration: {selectedBooking.duration || "90 minutes"}
                      </div>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Client Information
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          That's you! 👋
                        </p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedBooking.user?.first_name ||
                          selectedBooking.first_name ||
                          "Kheang"}{" "}
                        {selectedBooking.user?.last_name ||
                          selectedBooking.last_name ||
                          "Senghorng"}
                      </p>
                      {selectedBooking.user?.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedBooking.user.email}
                        </p>
                      )}
                      {selectedBooking.user?.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedBooking.user.phone}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        Booking ID: {selectedBooking.id || "BK-2024-001"}
                      </div>
                    </div>
                  </div>

                  {/* Location & Service Details */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Location & Service
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Where the magic happens
                        </p>
                      </div>
                    </div>
                    <div className="ml-13 space-y-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {selectedBooking.location || "Downtown Beauty Studio"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedBooking.address ||
                            "123 Main Street, Downtown"}
                        </p>
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Service Details:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedBooking.service?.description ||
                            "Professional styling and treatment service"}
                        </p>
                      </div>
                      {selectedBooking.notes && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                          <strong>Notes:</strong> {selectedBooking.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Friendly Note */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-lg">💡</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Friendly Reminder
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Please arrive 10 minutes early to ensure we can start
                        your appointment on time. We're excited to see you! 🌟
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Calendar;
