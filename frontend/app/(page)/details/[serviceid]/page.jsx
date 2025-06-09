"use client";

import React from "react";
import Gallery from "@/components/Gallery"; // Import the Image component
import Explore from "@/components/Explore";
import BookingForm from "@/components/BookingForm";
import PhnomPenhTour from "@/components/PhnomPenhTour";
import AdditionalInfo from "@/components/AdditionalInfo";
// import Reviews from "@/components/Reviews"; // Make sure you have it or remove it
import { useParams } from "next/navigation";
import ServicesForDetails from "@/components/ServicesForPage";

function PageTour() {
  const { serviceId } = useParams(); // Access the tour ID
  console.log(serviceId);
  if (!serviceId) {
    return <div className="p-4 text-red-500">Service ID is not provided.</div>;
  }
  // Log the service ID for debugging
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Gallery component */}
      <Gallery servicesId={serviceId} />
      {/* Explore component */}
      <div className="ml-4 mt-4">
        <Explore />
      </div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content (left) */}
        <div className="md:col-span-2">
          <PhnomPenhTour servicesId={serviceId} />
          <AdditionalInfo />
          {/* <Reviews /> */}
        </div>

        {/* Booking form (right) */}
        <div>
          <BookingForm servicesId={serviceId} />
        </div>
      </div>
      <div>
        <ServicesForDetails servicesId={serviceId} />
      </div>
    </div>
  );
}

export default PageTour;
