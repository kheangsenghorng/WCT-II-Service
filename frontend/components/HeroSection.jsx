import React from "react";
import Image from 'next/image'
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative  overflow-hidden">
      <div className="absolute inset-0">
      <Image
  src="/hero.png"
  alt="Hero image"
  fill
  style={{ objectFit: 'cover' }}
/>
      </div>

      <div className="relative container mx-auto py-24 px-4 md:px-8 lg:px-12 xl:px-16 z-10">
        <div className="max-w-lg text-left">
          <p className="text-gray-600 text-lg mb-4">Quality cleaning at a fair price.</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Specialized, efficient, and thorough cleaning services
          </h1>
          <p className="text-gray-700 mb-8">
            We provide Performing cleaning tasks using the least amount of time, energy, and money.
          </p>
          <Link
            href="/services"
            className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            View all Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;