"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useUserPayment } from "@/store/useUserPayment";  // Adjust store import
import { Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";

const PaymentsPage = () => {
  const { payments, loading, error, fetchPayments } = useUserPayment();  // Accessing payments state and methods from store

  useEffect(() => {
    fetchPayments();  // Fetch payments on page load
  }, [fetchPayments]);

  // Variants for framer-motion animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative min-h-screen">
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent shadow-md"></div>
          <p className="mt-4 text-green-600 dark:text-green-400 font-medium text-xl">Loading...</p>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        className="container mx-auto p-4 md:p-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">My Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">View your payment history and statuses.</p>
        </section>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Display Payments */}
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <motion.div
                key={payment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-300 p-4"
                variants={itemVariants}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-2">
                  {payment.bookingService}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{`$${payment.amount.toFixed(2)}`}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(payment.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  {payment.status === "Completed" ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      <span>{payment.status}</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center text-gray-500 dark:text-gray-300">No payments found.</div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default PaymentsPage;
