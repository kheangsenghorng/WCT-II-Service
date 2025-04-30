"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send } from "lucide-react";

const ContactUsPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic client-side validation
    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate sending data (replace with your actual API call)
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setError("Failed to send message. Please try again later.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <motion.div
      className="container mx-auto p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
          Get In Touch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          We'd love to hear from you! Let us know how we can help.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
            Contact Information
          </h2>
          <div className="space-y-5">
            <div className="flex items-start">
              <MapPin className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                  Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  123 Main Street, Anytown, CA 12345
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                  Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  info@example.com
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">
                  Phone
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  (123) 456-7890
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
            Send us a message
          </h2>
          {success && (
            <div className="bg-green-100 text-green-700 border border-green-500 py-3 px-4 rounded mb-4">
              Thank you! Your message has been sent.
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-500 py-3 px-4 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-4xl border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-4xl border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-md focus:outline-none focus:shadow-outline flex items-center justify-center"
            >
              Send Message <Send className="w-5 h-5 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUsPage; 