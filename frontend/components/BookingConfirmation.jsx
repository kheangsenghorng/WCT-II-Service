"use client";
import ConfirmBooking from "@/components/ConfirmBooking";
import BookingSummary from "@/components/BookingSummary";

const BookingConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-6xl py-10 px-4 md:px-10 rounded-lg ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <ConfirmBooking />
          </div>
          <div>
            <BookingSummary />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input {
          @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400;
        }
        .tab {
          @apply px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium;
        }
        .tab.active {
          @apply border-blue-500 text-blue-500;
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;
