"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function CompanyPage() {
  const { id } = useParams(); // owner ID from URL
  const router = useRouter();

  const {
    currentUser,
    users: companies,
    loading,
    error,
    fetchUsersByOwner,
  } = useUserStore();

  // Access control check
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role !== "owner" || currentUser.id !== id) {
      router.push("/unauthorized"); // protect route
      return;
    }

    fetchUsersByOwner(id); // only fetch if access is valid
  }, [id, currentUser, fetchUsersByOwner, router]);

  if (!currentUser) {
    return <div className="text-center mt-10">Checking permissions...</div>;
  }

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Companies</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">Here are the companies for this owner.</p>

      {error && (
        <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {companies?.map((company) => (
            <motion.div
              key={company.company_id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {company.company_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{company.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
