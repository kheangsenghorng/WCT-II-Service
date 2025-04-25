import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Install lucide-react

const ServicesSection = () => {
  const services = [
    {
      title: "Office Cleaning",
      description:
        "While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:",
      imageSrc: "/office-cleaning.jpg", // Replace with your actual image path
      link: "/office-cleaning",
    },
    {
      title: "Spring Cleaning",
      description:
        "While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:",
      imageSrc: "/spring-cleaning.jpg", // Replace with your actual image path
      link: "/spring-cleaning",
    },
    {
      title: "House Cleaning",
      description:
        "While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:",
      imageSrc: "/house-cleaning.jpg", // Replace with your actual image path
      link: "/house-cleaning",
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <div className="flex mb-12 space-x-20 px-5">
          <h2 className="text-6xl font-bold text-gray-800 mb-4">
            We Always Provide The Best Service
          </h2>
          <div>
          <p className=" text-2xl font-bold text-gray-800 py-5">Services</p>
          <p className="text-ml">While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services</p>
          </div>
        </div>

        

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Image
                src={service.imageSrc}
                alt={service.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <Link
                  href={service.link}
                  className="bg-green-500 text-white py-2 px-4 rounded-md inline-flex items-center hover:bg-green-600 transition-colors duration-200"
                >
                  Book Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;