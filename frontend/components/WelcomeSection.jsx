import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react"; // Install lucide-react

const WelcomeSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Image */}
        <div className="relative w-full h-auto flex justify-center">
          {/* Back Image */}
          <div className="w-[500px] md:w-[550px] rounded-2xl overflow-hidden border-[6px] border-green-500 z-0">
            <img
              src="/welcome.png"
              alt="Team"
              width={350}
              height={400}
              className="object-cover w-full h-auto"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome To Our cleaning-Pro Company!
          </h2>
          <p className="text-gray-600 mb-6">
            We make your space shine! Professional and reliable cleaning service
            company providing top-notch solutions for homes and businesses.
            Satisfaction guaranteed!"
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
