import React from "react";

const tours = [
  {
    id: "#sbbdd4",
    title: "Any where",
    image: "/1.jpg",
    bookedDate: "5/12/2025",
    status: "approved",
    seats: 1,
    price: 100,
    start: "5/17/2025",
    end: "5/20/2025",
  },
  {
    id: "#s5d658",
    title: "Any where",
    image: "/2.jpg",
    bookedDate: "5/15/2025",
    status: "approved",
    seats: 1,
    price: 100,
    start: "5/17/2025",
    end: "5/20/2025",
  },
];

export default function UserTourHistory() {
  const totalSeats = tours.reduce((acc, tour) => acc + tour.seats, 0);
  const totalPrice = tours.reduce((acc, tour) => acc + tour.price, 0);

  return (
    <div className="w-[1200px] mx-auto bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Tour History</h2>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
          Total Seats Booked: <strong>{totalSeats}</strong> &nbsp; 
          Total Price: <strong>${totalPrice}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Tour</th>
              <th className="px-4 py-3">Booked Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
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
                <td className="px-4 py-3">{tour.bookedDate}</td>
                <td className="px-4 py-3">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full capitalize">
                    {tour.status}
                  </span>
                </td>
                <td className="px-4 py-3">{tour.seats}</td>
                <td className="px-4 py-3">${tour.price}</td>
                <td className="px-4 py-3">{tour.start}</td>
                <td className="px-4 py-3">{tour.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
