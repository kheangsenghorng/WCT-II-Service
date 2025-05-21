import React from "react";

const tours = [
  {
    id: "#sbbdd4",
    title: "Angkor Wat Exploration",
    image: "/1.jpg",
    bookedDate: "5/12/2025",
    bookedTime: "12:00 PM - 1:00 PM",
    status: "approved",
    price: 150,
    location: "Siem Reap",
  },
  {
    id: "#s5d658",
    title: "Phnom Penh City Tour",
    image: "/2.jpg",
    bookedDate: "5/15/2025",
    bookedTime: "3:30 PM - 4:30 PM",
    status: "approved",
    price: 100,
    location: "Phnom Penh",
  },
];

export default function UserTourHistory() {
  const totalPrice = tours.reduce((acc, tour) => acc + tour.price, 0);

  return (
    <div className="w-[1200px] mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Service History</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Total Price: <strong>${totalPrice}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-green-600">Service</th>
              <th className="px-4 py-3 font-semibold text-green-600">Location</th>
              <th className="px-4 py-3 font-semibold text-green-600">Booked Date</th>
              <th className="px-4 py-3 font-semibold text-green-600">Scheduled Time</th>
              <th className="px-4 py-3 font-semibold text-green-600">Status</th>
              <th className="px-4 py-3 font-semibold text-green-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{tour.id}</p>
                    <p className="font-medium text-gray-800">{tour.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{tour.location}</td>
                <td className="px-4 py-3">{tour.bookedDate}</td>
                <td className="px-4 py-3">{tour.bookedTime}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    tour.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {tour.status}
                  </span>
                </td>
                <td className="px-4 py-3">${tour.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
