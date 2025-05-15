"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function BookingTestPage() {
  const bookingId = 18; // Change as needed
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);

  // Update Booking Status
  const updateBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8000/api/bookingtest/${bookingId}`,
        { status }
      );
      console.log("Booking updated:", response.data);
      alert("Booking updated and notifications sent.");
    } catch (error) {
      console.error(
        "Error updating booking:",
        error.response?.data || error.message
      );
      alert(
        "Update failed: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Poll booking status every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`http://localhost:8000/api/bookings/${bookingId}`)
        .then((res) => {
          setStatus(res.data.status);
        })
        .catch((err) => {
          console.error("Error fetching booking status:", err.message);
        });
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval); // Cleanup
  }, [bookingId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Update Booking Status</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Current Status:</label>
        <span className="inline-block px-3 py-1 bg-gray-200 rounded">
          {status}
        </span>
      </div>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 mb-4 block"
      >
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
        <option value="cancel">Cancel</option>
      </select>

      <button
        onClick={updateBooking}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Updating..." : "Update Booking"}
      </button>
    </div>
  );
}
