import React from 'react';
import Image from 'next/image';

const BookingSummary = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <Image
        src="/phnom-penh-tour.jpg"
        width={400}
        height={250}
        className="rounded-lg"
        alt="Phnom Penh Tour"
      />
      <h3 className="text-lg font-semibold mt-4">Phnom Penh Tour</h3>
      <ul className="text-sm text-gray-700 space-y-1 mt-2">
        <li>Date : Feb 20 – 25</li>
        <li>Time : 7:00 am</li>
      </ul>
      <div className="mt-4 font-bold text-lg border-t pt-2">
        Total <span className="float-right">$101.00</span>
      </div>
    </div>
  );
};

export default BookingSummary;
