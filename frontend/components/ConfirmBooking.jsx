"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useUserBooking } from "@/store/useUserBooking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ConfirmBooking = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState("");
  const [locationLink, setLocationLink] = useState("");

  const servicesId = searchParams.get("servicesId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const userId = searchParams.get("userId");

  const { user, fetchUserById } = useUserStore();
  const { createBooking } = useUserBooking();
  const LocationPickerMap = dynamic(() => import("./LocationPickerMap"), {
    ssr: false, // 👈 disables server-side rendering
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    location: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    country: "Cambodia",
    lastNameBilling: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phoneNumber: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = ({ latlng, address }) => {
    if (
      !latlng ||
      typeof latlng.lat !== "number" ||
      typeof latlng.lng !== "number"
    ) {
      console.error("Invalid latitude or longitude:", latlng);
      return;
    }

    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latlng.lat},${latlng.lng}`;

    console.log("Selected location:", latlng, address);

    setFormData({
      ...formData,
      location: address, // human-readable address
      locationLink: mapsLink, // for clickable map link
    });

    setShowMap(false);
  };

  const handleCountryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!servicesId) {
      alert("Missing service ID.");
      setIsSubmitting(false);
      return;
    }

    try {
      await createBooking(servicesId, {
        user_id: userId,
        location: formData.location,
        scheduled_date: date,
        scheduled_time: time,
        paymentMethod,
        paymentDetails:
          paymentMethod === "card"
            ? {
                cardNumber: formData.cardNumber,
                expirationDate: formData.expirationDate,
                cvv: formData.cvv,
                country: formData.country,
                lastNameBilling: formData.lastNameBilling,
              }
            : {},
      });

      setShowSuccessModal(true);
    } catch (error) {
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Confirm Your Booking
        </h1>
        <p className="text-gray-600">
          Complete your service booking details below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Details Section */}
        <Card className="border-0 shadow-sm ">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
              <User className="w-6 h-6 text-blue-600" />
              Your Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <select className="px-3 py-2 border border-gray-200 rounded-l-md bg-gray-50 text-sm border-r-0 focus:outline-none">
                    <option value="cam">🇰🇭</option>
                  </select>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled
                    className="flex-1 rounded-l-none bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                  className="bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <span>Service Location</span>
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="text-blue-500 underline"
                    aria-expanded={showMap}
                    aria-controls="location-map"
                  >
                    Pick on map
                  </button>
                </label>

                {formData.locationLink ? (
                  <a
                    href={formData.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-1 text-blue-600 underline"
                  >
                    {formData.location}
                  </a>
                ) : (
                  <input
                    type="text"
                    value={formData.location}
                    readOnly
                    placeholder="Lat, Lng"
                    className="w-full border p-2 mt-1"
                  />
                )}
              </div>

              {showMap && (
                <div
                  id="location-map"
                  className="mt-4 border rounded overflow-hidden"
                  style={{ height: 400 }}
                >
                  <LocationPickerMap onSelect={handleLocationSelect} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        {/* <Card className="border-0 shadow-sm ">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
              <CreditCard className="w-6 h-6 text-emerald-600" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">


          
          

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Payment Method
              </Label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                    paymentMethod === "card"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <CreditCard size={18} />
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("aba")}
                  className={`flex items-center gap-2 px-6 py-3 border-2 rounded-xl font-medium transition-all duration-200 ${
                    paymentMethod === "aba"
                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🏦 ABA Bank
                </button>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-6 p-6 bg-white rounded-xl border border-gray-100">
                <div className="space-y-2">
                  <Label
                    htmlFor="cardNumber"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    Credit Card Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="expirationDate"
                      className="text-sm font-medium text-gray-700 flex items-center gap-1"
                    >
                      Expiration Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="expirationDate"
                      name="expirationDate"
                      value={formData.expirationDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="cvv"
                      className="text-sm font-medium text-gray-700 flex items-center gap-1"
                    >
                      CVV/CVC <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700"
                    >
                      Country
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={handleCountryChange}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cambodia">🇰🇭 Cambodia</SelectItem>
                        <SelectItem value="Thailand">🇹🇭 Thailand</SelectItem>
                        <SelectItem value="Vietnam">🇻🇳 Vietnam</SelectItem>
                        <SelectItem value="Laos">🇱🇦 Laos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastNameBilling"
                      className="text-sm font-medium text-gray-700"
                    >
                      Billing Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lastNameBilling"
                      name="lastNameBilling"
                      value={formData.lastNameBilling}
                      onChange={handleInputChange}
                      placeholder="Billing last name"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "aba" && (
              <div className="p-8 bg-white rounded-xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ABA Bank Payment
                </h3>
                <p className="text-gray-600">
                  You will be redirected to ABA Bank's secure payment gateway to
                  complete your transaction.
                </p>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <p className="text-sm text-green-600">
            Your payment information is encrypted and secure. We never store
            your card details.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Confirm & Proceed
            </div>
          )}
        </Button>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </DialogTitle>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your booking has been successfully confirmed. You will receive a
              confirmation email shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Date:</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Time:</span>
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{formData.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push(`/profile/${id}/service-booked`);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                View Bookings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmBooking;
