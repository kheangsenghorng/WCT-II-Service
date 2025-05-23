// app/[id]/page/component/PhnomPenhTour.tsx

import React from "react";
import { useParams } from "next/navigation";
import { useServicesStore } from "@/store/useServicesStore";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

function PhnomPenhTour() {
  const { servicesId } = useParams();
  const { fetchServiceById, service, loading, error } = useServicesStore();

  React.useEffect(() => {
    if (servicesId) {
      fetchServiceById(servicesId);
    }
  }, [fetchServiceById, servicesId]);

  console.log(service);
  

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (loading) return <div className="p-4">Loading tour details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!service) return <div className="p-4">No service found</div>;

  // console.log("SERVICE", service);

  return (
    <motion.section
      id="Overview"
      className="container mx-auto p-4 sm:px-6 lg:px-8"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dark:bg-gray-800  rounded-lg overflow-hidden">
        {/* Hero Section */}
        <header className="relative text-left py-12 px-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {service?.name}
          </h1>
          <div className="mt-4 flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 text-yellow-400" // Update classNames here
              />
            ))}
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              4.5 (125 reviews)
            </span>
          </div>
        </header>

        {/* Overview Section */}
        <section className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Description
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {service.description}
          </p>
        </section>
      </div>
    </motion.section>
  );
}

export default PhnomPenhTour;