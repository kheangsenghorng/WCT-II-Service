// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { useServicesStore } from "@/store/useServicesStore";

// const ServicesSection = () => {
//   // Zustand store selectors
//   const {
//     services,
//     loading,
//     error,
//     fetchAllServices,
//   } = useServicesStore((state) => ({
//     services: state.services,
//     loading: state.loading,
//     error: state.error,
//     fetchAllServices: state.fetchAllServices,
//   }));

//   useEffect(() => {
//     fetchAllServices();
//   }, [fetchAllServices]);

//   return (
//     <section className="bg-white py-16">
//       <div className="container mx-auto px-4">
//         {/* Title and Description */}
//         <div className="flex mb-12 space-x-20 px-5">
//           <div className="max-w-xl">
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
//               We Always Provide The Best Cleaning Service
//             </h2>
//           </div>
//           <div className="max-w-md">
//             <p className="text-xl font-semibold text-gray-800 mb-2">Services</p>
//             <p className="text-gray-600 leading-relaxed">
//               We can customize your cleaning plan to suit your needs. Most clients
//               schedule regular cleaning services to maintain a pristine home.
//             </p>
//           </div>
//         </div>

//         {/* Loading and Error */}
//         {loading && (
//           <p className="text-center text-gray-500">Loading services...</p>
//         )}
//         {error && (
//           <p className="text-center text-red-500">Error: {error}</p>
//         )}

//         {/* Services Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {!loading && services.length === 0 && (
//             <p className="col-span-3 text-center text-gray-500">
//               No services found.
//             </p>
//           )}

//           {services.map((service) => (
//             <div
//               key={service.id}
//               className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//             >
//               <div className="relative">
//                 <Image
//                   src={service.image || "/default-service.jpg"}
//                   alt={service.title}
//                   width={800} // Increased for higher resolution
//                   height={500} // Increased for higher resolution
//                   className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
//                 />
//                 <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
//               </div>
//               <div className="p-6 relative">
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {service.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-4">{service.description}</p>
//                 <Link
//                   href={`/services/${service.id}`}
//                   className="bg-green-500 text-white py-2 px-4 rounded-md inline-flex items-center hover:bg-green-600 transition-colors duration-200 absolute bottom-4 right-4"
//                 >
//                   Book Now
//                   <ArrowRight className="ml-2 w-4 h-4" />
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServicesSection;


"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useServicesStore } from "@/store/useServicesStore";


const services = [
  {
    title: "Office Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team2.webp",
  },
  {
    title: "Floor Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team2.webp",
  },
  {
    title: "Carpet Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team2.webp",
  },
  {
    title: "Carpet Cleaning",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    image: "/images/team3.webp",
  },
];



const ServicesSection = () => {
 return (

    <div className="py-16 px-8 md:px-20 lg:px-26 md:flex-row">
    <div className="flex flex-col md:flex-row items-center justify-between bg-white">
      <div>
        <h1 className="text-4xl font-bold text-black">
          We always provide the best service
        </h1>
      </div>
      <div className="text-left mt-8 md:mt-0 lg:ps-40">
        <h2 className="text-3xl font-semibold text-green-500">Services</h2>
        <p className="text-gray-600">
          While we can customize your cleaning plan to suit your needs, most clients schedule regular cleaning services:
        </p>
      </div>
    </div>

<section className="py-16 bg-white">
  <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
    {services.map((service, index) => (
      <Link key={index} href={`/services/${service.id}`} className="group">
        <div className="bg-white shadow-md rounded-2xl border border-gray-350 p-4 flex flex-col items-start transition duration-300 ease-in-out transform hover:scale-105">
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
  );

};

export default ServicesSection;

