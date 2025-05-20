"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";


const services = [
  {
    title: "Office Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team3.webp",
  },
  {
    title: "Floor Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team3.webp",
  },
  {
    title: "Carpet Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team3.webp",
  },
  {
    title: "Carpet Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team3.webp",
  },
];

const BlogSection = () => {

    return(
        <div>
            <div className="py-16 px-8 md:px-20 lg:px-26 md:flex-row">
            <div className="flex flex-col md:flex-row items-center justify-between bg-white">
            <div>
                <h1 className="text-4xl font-bold text-black">
                Stay Updated with Our 
Tips & Service News!
                </h1>
            </div>
            <div className="text-left mt-8 md:mt-0 lg:ps-40">
                <h2 className="text-3xl font-semibold text-green-500">Our Blog</h2>
                <p className="text-gray-600">
                Stay informed with our latest cleaning tips, service updates, expert advice on maintaining an immaculate home
                </p>
            </div>
            </div>

      <section className="py-16 bg-white">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
                {services.map((service, index) => (
                  <Link key={index} href={`/services/${service.id}`} className="group">
                    <div className="bg-white shadow-md rounded-2xl border border-gray-350 p-4 flex flex-col items-start transition-transform duration-300 transform hover:scale-105">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                      <div className="relative w-full h-58 rounded-xl overflow-hidden">
                        <Image
                          src={service.image}
                          alt={service.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-xl object-fit-cover object-top"
                        />
                        <div className="absolute bottom-3 right-3 bg-yellow-400 rounded-full p-2 shadow-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
        </section>

            </div>
        </div>
    )
}
export default BlogSection;