"use client";
import React, { useEffect } from "react";
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
const teamMembers = [
  {
    name: "Mona Lisa",
    image: "/images/team1.jpg", // replace with your actual image path
    description: "He is an expert cleaning staff member who provides thorough cleaning with precision.",
  },
  {
    name: "Erick Reynolds",
    image: "/images/team2.webp",
    description: "He is an expert cleaning staff member who provides thorough cleaning with precision.",
  },
  {
    name: "Jannie Smith",
    image: "/images/team3.webp",
    description: "He is an expert cleaning staff member who provides thorough cleaning with precision.",
  },
];


const ExpertTeamSection = () => {

    return(

            <div className="py-6 px-8 md:px-20 lg:px-26 md:flex-row">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white">
              <div>
                <h1 className="text-4xl font-bold text-black">
                 Effective Cleaning Requires an Expert Cleaning Team
                </h1>
              </div>
              <div className="text-left mt-8 md:mt-0 lg:ps-40">
                <h2 className="text-3xl font-semibold text-green-500">Expert Team</h2>
                <p className="text-gray-600">
                 We have professional expert cleaning staff ensuring top-notch cleanliness and hygiene for your space.
                </p>
              </div>
            </div>
        
          <section className="py-16 bg-white">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Team Cards */}
              {teamMembers.map((member, index) => (
  <div
    key={index}
    className="bg-white rounded-lg shadow-md p-4 text-center border border-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105"
  >
    <div className="relative w-full h-60 mb-4 rounded-lg overflow-hidden">
      <Image
        src={member.image}
        alt={member.name}
        fill
        style={{ objectFit: 'cover', objectPosition: 'top' }}
        className="rounded-lg"
        priority={index === 0} // optional: prioritize loading first image
      />
    </div>
    <h3 className="font-semibold text-lg">{member.name}</h3>
    <div className="text-yellow-500 text-2xl my-1">★★★★★</div>
    <p className="text-sm text-gray-600 mb-4">{member.description}</p>
    <div className="flex justify-center space-x-4 text-gray-600">
      <FaFacebookF className="hover:text-blue-600 text-blue-700 cursor-pointer" />
      <FaTwitter className="hover:text-blue-400 text-blue-700 cursor-pointer" />
      <FaInstagram className="hover:text-pink-500 text-pink-600 cursor-pointer" />
      <FaLinkedinIn className="hover:text-blue-700 text-blue-700 cursor-pointer" />
    </div>
  </div>
))}
</div>
</section>

</div>
      
 )
}

export default ExpertTeamSection;