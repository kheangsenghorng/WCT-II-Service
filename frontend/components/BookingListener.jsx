// "use client";

// import { useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { initializeEcho } from "../util/echo";
// import useBookingNotifications from "../util/useBookingNotifications";

// export default function BookingListener({ ownerId }) {
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (session?.accessToken) {
//       initializeEcho(session.accessToken);
//     }
//   }, [session]);

//   useBookingNotifications(ownerId, (notification) => {
//     console.log("Received booking notification:", notification);
//   });

//   return null;
// }
