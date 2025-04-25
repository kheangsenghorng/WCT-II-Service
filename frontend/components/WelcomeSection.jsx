import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react"; // Install lucide-react

const WelcomeSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div className="relative ">
          <div className="absolute top-8 left-8 w-full h-full border-4 border-green-500 rounded-3xl overflow-hidden z-0">
            <Image
              src="/Hero.png" // Replace with your image path
              alt="Cleaning Team"
              width={600}
              height={400}
              className="w-full h-full object-cover absolute z-10 "
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome To Our cleaning-Pro Company!
          </h2>
          <p className="text-gray-600 mb-6">
            We make your space shine! Professional and reliable cleaning service company providing top-notch solutions for homes and businesses. Satisfaction guaranteed!"
          </p>

          {/* List of Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Vetted professionals
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Affordable Prices
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Next day availability
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Best Quality
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Standard cleaning tasks
            </div>
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Affordable Prices
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Link
              href="/join"
              className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors duration-200"
            >
              Join With Us
            </Link>
            <Link
              href="/about"
              className="bg-white text-gray-700 py-3 px-6 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;