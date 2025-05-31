"use client";

import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's marker icons for Next.js
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

// Prevent duplicate map initialization
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

export default function BookingMap({ lat, lng, location }) {
  // fallback position if lat/lng not passed
  const position = useMemo(() => {
    return lat && lng ? [lat, lng] : [51.505, -0.09];
  }, [lat, lng]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>{location || "Booking Location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
