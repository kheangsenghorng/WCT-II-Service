// components/users/AddUserModal.jsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const AddUserModal = ({
  isOpen,
  onClose,
  onAddUser,
  emailChecking,
  emailAvailable,
  checkEmailAvailability,
  newEmail,
  setNewEmail,
  newFirstName,
  setNewFirstName,
  newLastName,
  setNewLastName,
  newPhone,
  setNewPhone,
  phoneChecking,
  phoneAvailable,
  checkPhoneAvailability,
  newPassword,
  newConfirmPassword,
  handlePasswordChange,
  handleImageChange,
  selectedImage,
  imagePreview,
  errors,
  errorMessage,
  loading,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-2">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Add Staff
        </h2>

        {errorMessage && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}

        <form>
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="first_name"
                className="block text-sm font-semibold text-gray-800 dark:text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex-1">
              <label
                htmlFor="last_name"
                className="block text-sm font-semibold text-gray-800 dark:text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={newEmail}
              onChange={(e) => {
                const value = e.target.value;
                setNewEmail(value);
                if (value.length >= 4) checkEmailAvailability(value);
              }}
              className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {emailChecking && <p className="text-sm text-gray-500">Checking email...</p>}
            {emailAvailable === false && (
              <p className="text-sm text-red-500">{errors.email?.[0]}</p>
            )}
            {emailAvailable === true && (
              <p className="text-sm text-green-500">Email is available.</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-800 dark:text-white"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              value={newPhone}
              onChange={(e) => {
                const value = e.target.value;
                setNewPhone(value);
                if (value.length >= 6) checkPhoneAvailability(value);
              }}
              className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {phoneChecking && <p className="text-sm text-gray-500">Checking phone...</p>}
            {phoneAvailable === false && (
              <p className="text-sm text-red-500">{errors.phone?.[0]}</p>
            )}
            {phoneAvailable === true && (
              <p className="text-sm text-green-500">Phone number is available.</p>
            )}
            {newPhone && newPhone.length < 6 && (
              <p className="text-sm text-yellow-500">
                Please enter at least 6 digits to check availability.
              </p>
            )}
          </div>

          {/* Passwords */}
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => handlePasswordChange("password", e.target.value)}
                className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-semibold text-gray-800 dark:text-white"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={newConfirmPassword}
                onChange={(e) =>
                  handlePasswordChange("password_confirmation", e.target.value)
                }
                className="w-full px-4 py-2 text-gray-800 dark:text-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-800 dark:text-white"
            >
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-full border"
                />
              )}
              <input
                type="file"
                id="image"
                onChange={handleImageChange}
                className="text-sm text-gray-600 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAddUser}
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddUserModal;
