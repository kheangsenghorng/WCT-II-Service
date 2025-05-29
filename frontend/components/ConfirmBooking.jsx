import React, { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useUserBooking } from "@/store/useUserBooking";

const ConfirmBooking = () => {
  const searchParams = useSearchParams();
  const params = useParams();

  const servicesId = searchParams.get("servicesId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const userId = searchParams.get("userId");

  const { user, fetchUserById } = useUserStore();
  const { createBooking } = useUserBooking();

  const [paymentMethod, setPaymentMethod] = useState("card");
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

  useEffect(() => {
    if (userId) {
      fetchUserById(userId); // optionally change this to auth user ID if needed
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!servicesId) {
      alert("Missing service ID.");
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

      alert("Booking confirmed successfully!");
    } catch (error) {
      alert("Failed to confirm booking. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg">
      <h1 className="text-2xl font-semibold mb-8 text-green-600">
        Confirm Booking
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Your details section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Your details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <select className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm">
                  <option value="cam">Cam</option>
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled
                  className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Payment section */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Payment Information
          </h2>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                paymentMethod === "card"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              <CreditCard size={16} />
              Card
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("aba")}
              className={`flex items-center gap-2 px-4 py-2 border rounded-md ${
                paymentMethod === "aba"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700"
              }`}
            >
              ABA
            </button>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Credit Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 1234 1234 1234"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    CVV/CVC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="CVC"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Cambodia">Cambodia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Laos">Laos</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="lastNameBilling"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastNameBilling"
                    name="lastNameBilling"
                    value={formData.lastNameBilling}
                    onChange={handleInputChange}
                    placeholder="Billing last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 focus:ring-2 focus:ring-green-500"
        >
          Confirm & Proceed
        </button>
      </form>
    </div>
  );
};

export default ConfirmBooking;
