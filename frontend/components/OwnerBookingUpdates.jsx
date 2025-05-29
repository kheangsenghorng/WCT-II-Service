"use client";

import { useEffect, useState } from "react";
import { getEcho } from "@/util/echo";
import { toast } from "react-hot-toast";

const OwnerBookingUpdates = ({ ownerId }) => {
  const [echo, setEcho] = useState(null);

  useEffect(() => {
    if (!ownerId) return;

    getEcho().then((e) => {
      if (!e) return;
      setEcho(e); 

      const channel = e.private(`owner.${ownerId}`);

      channel.listen(".booking.notification", (data) => {
        console.log("📦 Booking Notification:", data);
        toast.success(data.message);
      });
    });

    return () => {
      if (echo) {
        echo.leave(`owner.${ownerId}`);
      }
    };
  }, [ownerId]);

  return null;
};

export default OwnerBookingUpdates;
