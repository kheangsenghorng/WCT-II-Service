"use client"

import { useStaffAssignmentStore } from "@/store/useStaffAssignmentStore"
import { Phone, Mail, MapPin, User, Users } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"

export default function StaffProvider() {
  const { id, viewdetailid } = useParams()

  const bookingId = viewdetailid?.[1] || null
  const { staffByBooking, fetchStaffByBookingUser, loading: staffLoading } = useStaffAssignmentStore()

  useEffect(() => {
    if (bookingId) {
      fetchStaffByBookingUser(bookingId)
    }
  }, [bookingId, fetchStaffByBookingUser])

  return (
    <div className="max-w-8xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Users className="text-gray-600 dark:text-gray-400" size={20} />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assigned Staff</h2>
          <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2 py-1 rounded-full">
            {staffByBooking.length} members
          </span>
        </div>
      </div>

      {/* Loading State */}
      {staffLoading ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="px-6 py-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                </div>
                <div className="flex space-x-4">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : staffByBooking.length > 0 ? (
        /* Staff List */
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {staffByBooking.map((staff, index) => (
            <motion.div
              key={staff.id || index}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                {/* Left: Profile & Name */}
                <div className="flex items-center space-x-4">
                  <img
                    src={staff.image || "/placeholder.svg?height=48&width=48"}
                    alt={`${staff.first_name || "Staff"} profile`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {staff.first_name && staff.last_name ? `${staff.first_name} ${staff.last_name}` : "Staff Member"}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin size={12} />
                      <span>{staff.location || "Location not specified"}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Contact Info */}
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                      <Phone size={14} />
                      <span>{staff.phone || "Phone not available"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                      <Mail size={14} />
                      <span className="max-w-[150px] truncate">{staff.email || "Email not available"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="px-6 py-12 text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No staff assigned</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Staff will be assigned to your booking soon.</p>
        </div>
      )}
    </div>
  )
}
