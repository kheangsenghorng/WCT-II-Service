"use client";

import Gallery from "@/components/Gallery";
import Exlpore from "@/components/Explore";
import PhnomPenhTour from "@/components/PhnomPenhTour";
import BookingForm from "@/components/BookingForm";
import CardRoomType from "@/components/CardRoomType";
// import Reviews from "@/components/Reviews";
import { useParams } from "next/navigation";

export default function PageTour() {
  const { servicesId } = useParams();

  return (
    <div>
      <Gallery servicesId={servicesId} />
      <Exlpore />
      <div className="flex justify-between mx-auto w-[1200px]">
        <div className="w-[800px]">
          <PhnomPenhTour servicesId={servicesId} />
          <CardRoomType />
          {/* <Reviews tourId={tourId} /> */}
        </div>
        <div>
          <BookingForm servicesId={servicesId}  />
        </div>
      </div>
    </div>
  );
}
