"use client"
import ConfirmBooking from "@/components/ConfirmBooking"
import BookingSummary from "@/components/BookingSummary"

const BookingConfirmation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600 text-lg">You're just one step away from your perfect stay</p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 lg:gap-12">
            {/* Booking Form Section */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Booking Details</h2>
                </div>
                <div className="p-6 lg:p-8">
                  <ConfirmBooking />
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="xl:col-span-2">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Booking Summary</h2>
                  </div>
                  <div className="p-6 lg:p-8">
                    <BookingSummary />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation
