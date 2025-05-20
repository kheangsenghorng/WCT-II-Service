"use client";

import Image from "next/image";

const HighQuality = () => {
  return (
    <div className="bg-white flex flex-col md:flex-row items-center justify-between py-4 px-8 md:px-24 lg:px-32">
      {/* Text Content */}
      <div className="md:w-1/2 mb-8 md:mb-0">
        <p className="text-green-500 font-semibold mb-2">
          Affordable cleaning solutions
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          High-Quality and Friendly Services at Fair Prices
        </h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          We provide comprehensive cleaning services tailored to your needs. From
          residential cleaning services to commercial cleaning and more, we’ve
          got you covered.
        </p>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md">
          Get a quote
        </button>
      </div>

      {/* Image Section */}
      <div className="relative w-full lg:w-1/2 flex justify-center">
        <div className="relative w-132 h-90">
          <Image
            src="/HighQuality.png"
            alt="Cleaning woman"
            width={400}
            height={300}
            className="rounded-lg border-4 border-green-500 object-cover w-full h-full"
          />
        </div>
      </div>
    </div> // ✅ Closing tag for the outermost div
  );
};

export default HighQuality;
