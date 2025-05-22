"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
// import Gallery from "@/components/Gallery";
// import Explore from "@/components/Explore";
import ServiceDetails from "@/components/ServiceDetails";
// import BookingForm from "@/components/BookingForm";
// import CardRoomType from "@/components/CardRoomType";
// import Reviews from "@/components/Reviews";
import { useServicesStore } from "@/store/useServicesStore"; // Ensure this path is correct

export default function PageServiceDetails() {
  const { id: ownerId, serviceId } = useParams();
  const { fetchService, service, loading, error } = useServicesStore();

  useEffect(() => {
    if (ownerId && serviceId) {
      fetchService(ownerId, serviceId);
    }
  }, [ownerId, serviceId]);

  if (loading) return <p className="text-center py-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!service) return <p className="text-center py-10">No service found.</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* Gallery */}
      {/* <section className="max-w-6xl mx-auto px-4">
        <Gallery gallery={service.images} />
      </section> */}

      {/* Explore section (optional) */}
      {/* <section className="max-w-6xl mx-auto px-4">
        <Explore />
      </section> */}

      {/* Main content layout */}
      <section className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 px-4">
        {/* Left: Details */}
        <div className="flex-1 space-y-6">
          <ServiceDetails service={service} />
          {/* <CardRoomType serviceId={serviceId} />
          <Reviews serviceId={serviceId} /> */}
        </div>

        {/* Right: Booking */}
        {/* <div className="w-full lg:w-1/3">
          <BookingForm serviceId={serviceId} />
        </div> */}
      </section>
    </div>
  );
}





export default function PageServiceDetails() {
  return (
    <div>
<h1>Service Details</h1>
    </div>
  );
}