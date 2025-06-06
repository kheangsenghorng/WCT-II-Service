"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react"
import { useBookingStoreFetch } from "@/store/bookingStore"
import { useParams } from "next/navigation"
import Link from "next/link"

const BookedServiceCard = () => {
  const { id } = useParams()
  const userId = id
  const { bookings, loading, error, fetchBookingsByUserId } = useBookingStoreFetch()

  const [currentPage, setCurrentPage] = useState(1)
  const bookingsPerPage = 3

  useEffect(() => {
    if (userId) {
      fetchBookingsByUserId(userId)
    }
  }, [userId])

  const getStatusBadge = (date) => {
    const bookingDate = new Date(date)
    const today = new Date()
    const diffTime = bookingDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: "Completed", color: "bg-green-100 text-green-700" }
    } else if (diffDays === 0) {
      return { text: "Today", color: "bg-orange-100 text-orange-700" }
    } else if (diffDays <= 7) {
      return { text: "Upcoming", color: "bg-blue-100 text-blue-700" }
    } else {
      return { text: "Scheduled", color: "bg-gray-100 text-gray-700" }
    }
  }

  // Compute pagination
  const totalBookings = bookings?.length || 0
  const totalPages = Math.ceil(totalBookings / bookingsPerPage)
  const startIndex = (currentPage - 1) * bookingsPerPage
  const endIndex = startIndex + bookingsPerPage
  const currentBookings = bookings.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 text-sm">Loading...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm mx-auto">
          <p className="text-red-600 text-sm font-medium">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-6 max-w-sm mx-auto">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">No bookings found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Your Bookings</h2>
        <p className="text-gray-600 text-sm">Manage your service appointments</p>
      </div>

      {currentBookings.map((booking, index) => {
        const service = booking.service
        if (!service) return null

        const status = getStatusBadge(booking.scheduled_date)

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-gray-200"
          >
            <div className="flex">
              {/* Compact Image */}
              <div className="relative w-42 h-52 flex-shrink-0">
                <img
                  src={
                    service.images && service.images.length > 0
                      ? service.images[0]
                      : "/placeholder.svg?height=128&width=128"
                  }
                  alt={service.name || "Service"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}>{status.text}</span>
                </div>
              </div>

              {/* Compact Content */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-gray-900 text-base truncate mb-1">
                      {service.name || "Service Name"}
                    </h3>
                    <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                      {service.description || "No description available."}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-gray-900">${service.base_price || "0.00"}</div>
                  </div>
                </div>

                {/* Compact Details */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs">Date</p>
                      <p className="font-medium text-gray-900 truncate">
                        {new Date(booking.scheduled_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-3 h-3 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs">Time</p>
                      <p className="font-medium text-gray-900 truncate">
                        {new Date(`1970-01-01T${booking.scheduled_time}`).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-3 h-3 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs">Provider</p>
                      <p className="font-medium text-gray-900 truncate">
                        {`${booking?.service?.owner?.first_name || ""} ${booking?.service?.owner?.last_name || ""}`.trim() ||
                          "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs">Location</p>
                      <p className="font-medium text-gray-900 truncate">{booking.location}</p>
                    </div>
                  </div>
                </div>

                {/* Compact Action */}
                <div className="flex justify-end">
                  <Link href={`/profile/${userId}/view-detail/${service.id}/${booking.id}`}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                    >
                      View Details
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Compact Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            {startIndex + 1}-{Math.min(endIndex, totalBookings)} of {totalBookings}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-xs font-medium ${
                currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              Prev
            </button>

            <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">{currentPage}</span>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-xs font-medium ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookedServiceCard
