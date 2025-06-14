"use client";

import React from "react";
import Gallery from "@/components/Gallery";
// import Explore from "@/components/Explore";
import BookingForm from "@/components/BookingForm";
import PhnomPenhTour from "@/components/PhnomPenhTour";
import AdditionalInfo from "@/components/AdditionalInfo";
// import Reviews from "@/components/Reviews"; // Uncomment if you have this component
import { useParams } from "next/navigation";
import ServicesForDetails from "@/components/ServicesForPage";

function PageTour() {
  const params = useParams();
  const serviceId = params?.serviceId;
  console.log(params);

  // if (!serviceId) {
  //   return <div className="p-4 text-red-500">Service ID is not provided.</div>;
  // }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Gallery component */}
      <Gallery servicesId={serviceId} />

      {/* Explore component */}
      {/* <div className="ml-4 mt-4">
        <Explore />
      </div> */}

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

      {/* Services details section */}
      <div>
        <ServicesForDetails servicesId={serviceId} />
      </div>
    </div>
  );
}

export default PageTour;
