// "use client"; // if you're using app directory

// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import "leaflet/dist/leaflet.css";

// const Map = dynamic(() => import("./Map"), { ssr: false }); // dynamically load with SSR disabled

// const MapSelector = () => {
//   const [selectedPosition, setSelectedPosition] = useState(null);

//   return (
//     <div className="h-96">
//       <Map onSelect={setSelectedPosition} />
//       {selectedPosition && (
//         <p className="mt-2 text-sm">Lat: {selectedPosition.lat}, Lng: {selectedPosition.lng}</p>
//       )}
//     </div>
//   );
// };

// export default MapSelector;
