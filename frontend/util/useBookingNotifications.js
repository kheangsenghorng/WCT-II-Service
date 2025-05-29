// import { useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { initializeEcho } from "./echo";

// export default function useBookingNotifications(ownerId, callback) {
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (!ownerId || !session?.accessToken || !callback) return;

//     const echo = initializeEcho(session.accessToken);
//     if (!echo) return;

//     const channelName = `private-owner.${ownerId}`;
//     echo.private(channelName).listen(".booking.notification", (data) => {
//       console.log("New booking notification:", data);
//       callback(data);
//     });

//     return () => {
//       echo.leave(channelName);
//     };
//   }, [ownerId, session?.accessToken, callback]);
// }
