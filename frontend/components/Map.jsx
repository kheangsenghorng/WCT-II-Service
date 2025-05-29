// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { useState } from "react";
// import L from "leaflet";

// const LocationMarker = ({ onSelect }) => {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const coords = e.latlng;
//       setPosition(coords);
//       onSelect(coords);
//     },
//   });

//   return position ? <Marker position={position} /> : null;
// };

// const Map = ({ onSelect }) => {
//   return (
//     <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full z-0">
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="© OpenStreetMap contributors"
//       />
//       <LocationMarker onSelect={onSelect} />
//     </MapContainer>
//   );
// };

// export default Map;
