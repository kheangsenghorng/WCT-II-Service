import React from "react";
import Link from "next/link";

const heroData = {
  backgroundImage: "/hero.png",
  tagline: "Quality cleaning at a fair price.",
  title: "Specialized, efficient, and thorough cleaning services",
  description:
    "We provide Performing cleaning tasks using the least amount of time, energy, and money.",
  buttonText: "View all Services",
  buttonLink: "/services",
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <img
        src={heroData.backgroundImage}
        alt="Hero image"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content */}
      <div className="relative container mx-auto py-24 px-4 md:px-8 lg:px-12 xl:px-16 z-10">
        <div className="max-w-lg text-left">
          <p className="text-gray-600 text-lg mb-4">{heroData.tagline}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {heroData.title}
          </h1>
          <p className="text-gray-700 mb-8">{heroData.description}</p>
          <Link
            href={heroData.buttonLink}
            className="inline-block bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            {heroData.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
