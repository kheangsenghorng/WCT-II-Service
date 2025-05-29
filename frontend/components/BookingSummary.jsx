import React, { useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useServicesStore } from "@/store/useServicesStore";

const BookingSummary = () => {
  const searchParams = useSearchParams();
  const { fetchServiceById, service, loading, error } = useServicesStore();

  const userId = searchParams.get("userId");
  const servicesId = searchParams.get("servicesId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  useEffect(() => {
    if (userId) {
      fetchServiceById(servicesId);
    }
  }, [fetchServiceById, servicesId]);

  let formattedDate = "N/A";
  let formattedTime = "N/A";

  if (date && time) {
    const dateTimeString = `${date}T${time}`;
    const dateObj = new Date(dateTimeString);

    formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Image
        src={service?.images?.[0] || "/default-clean.webp"}
        width={400}
        height={250}
        className="rounded-lg"
        alt={service?.name || "Service Image"}
      />
      <h3 className="text-lg font-semibold mt-4">
        {service?.name || "Service Name"}
      </h3>
      <ul className="text-sm text-gray-700 space-y-1 mt-2">
        <li>Date: {formattedDate}</li>
        <li>Time: {formattedTime}</li>
      </ul>
      <div className="mt-4 font-bold text-lg border-t pt-2">
        Total{" "}
        <span className="float-right">
          {service?.base_price ? `$${service.base_price}/h` : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default BookingSummary;
