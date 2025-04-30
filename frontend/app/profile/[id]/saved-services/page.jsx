"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Menu } from "lucide-react";

const SavedPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  useEffect(() => {
    fetchSavedRestaurants();
  }, []);

  const fetchSavedRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/saved-services`);  // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRestaurants(data);
    } catch (err) { // Removed ": any"
      // setError(`Error fetching saved restaurants: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    setRestaurantToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const confirmRemove = async () => {
    try {
      // Replace with your actual API endpoint for removing a saved restaurant
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/saved-services/${restaurantToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Update the local state after successful removal
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== restaurantToDelete)
      );
      setShowDeleteConfirmation(false);
    } catch (err) { // Removed ": any"
      setError(`Error removing restaurant: ${err.message}`);
    }
  };

  const cancelRemove = () => {
    setRestaurantToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  // Inlined DeleteConfirmationModal component
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-md shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">Confirm Remove</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to remove this {itemType}?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Saved Restaurants</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurant and cuisines..."
            className="pl-5 pr-10 py-2 w-full border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
          />
          <div className="absolute top-0 right-0 mt-1 mr-2 h-full flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading saved restaurants...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-500 text-red-700 py-3 px-4 rounded">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              className="bg-white dark:bg-gray-50 rounded-2xl shadow-md p-4 flex items-center justify-between"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <Link href={restaurant.menuLink} className="text-green-500 hover:underline">
                      <Menu className="w-4 h-4 inline-block mr-1" /> View menu
                    </Link>
                    <span className="text-gray-500">🍽️ {restaurant.cuisine}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemove(restaurant.id)}
                className="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Inlined Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={cancelRemove}
        onConfirm={confirmRemove}
        itemType="Services"
      />
    </motion.div>
  );
};

export default SavedPage;