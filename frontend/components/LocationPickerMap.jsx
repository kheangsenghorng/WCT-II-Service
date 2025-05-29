import { useEffect, useRef } from "react";
import L from "leaflet";

const LocationPickerMap = ({ onSelect }) => {
  const mapRef = useRef(null);
  const timeoutRef = useRef(null);
  const cache = {};

  const reverseGeocode = async (lat, lng) => {
    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    if (cache[key]) {
      return cache[key];
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const address = data.display_name || key;
      cache[key] = address;
      return address;
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return key;
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map-container").setView([11.562108, 104.888535], 13);
      
      L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
        attribution: 'Map tiles by Stamen Design'
      }).addTo(mapRef.current);
      
      
      mapRef.current.on("click", (e) => {
        if (!e.latlng) return;
        const { lat, lng } = e.latlng;

        // Clear any previous timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Debounce reverse geocoding by 300ms
        timeoutRef.current = setTimeout(async () => {
          const address = await reverseGeocode(lat, lng);
          onSelect({ latlng: { lat, lng }, address });
        }, 300);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onSelect]);

  return <div id="map-container" style={{ height: "300px", width: "100%" }}></div>;
};

export default LocationPickerMap;
