"use client"
import { useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useServicesStore } from "@/store/useServicesStore"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Clock, DollarSign, Star, Shield, User } from "lucide-react"

const BookingSummary = () => {
  const searchParams = useSearchParams()
  const { fetchServiceById, service, loading, error } = useServicesStore()

  const userId = searchParams.get("userId")
  const servicesId = searchParams.get("servicesId")
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  useEffect(() => {
    if (servicesId) {
      fetchServiceById(servicesId)
    }
  }, [fetchServiceById, servicesId])

  let formattedDate = "N/A"
  let formattedTime = "N/A"

  if (date && time) {
    const dateTimeString = `${date}T${time}`
    const dateObj = new Date(dateTimeString)

    formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }


  return (
    <div className="space-y-6">
      {/* Service Image & Basic Info */}
     

        <div className="p-6 space-y-6">
          {/* Service Image */}
          <div className="relative">
            <Image
              src={service?.images?.[0] || "/default-clean.webp"}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-xl"
              alt={service?.name || "Service Image"}
            />
            <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-600">
              <Star className="w-3 h-3 mr-1" />
              4.9
            </Badge>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{service?.name || "Service Name"}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">Professional Service</span>
              </div>
            </div>

            {/* Service Features */}
            {service?.description && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Service Features</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Insured
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <User className="w-3 h-3 mr-1" />
                    Professional
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Top Rated
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Booking Details</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Service Date
                </div>
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Service Time
                </div>
                <span className="text-sm font-medium">{formattedTime}</span>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  Service Provider
                </div>
                <span className="text-sm font-medium">Professional Team</span>
              </div> */}
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Price Details</h4>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price Details</span>
                <span>{service?.base_price ? `$${service.base_price}/hour` : "N/A"}</span>
              </div>

              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span>$5</span>
              </div> */}

              {/* <div className="flex justify-between text-sm">
                <span className="text-gray-600">Insurance</span>
                <span>Included</span>
              </div> */}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span className="flex items-center gap-1">
                <DollarSign className="w-5 h-5" />
                Total Price 
              </span>
              <span>{service?.base_price ? `$${service.base_price}/hour` : "N/A"}</span>
            </div>
          </div>

          {/* Security Badge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Booking</span>
            </div>
            <p className="text-xs text-green-600 mt-1">Your booking is protected with our satisfaction guarantee</p>
          </div>
        </div>
      </div>
  )
}

export default BookingSummary
