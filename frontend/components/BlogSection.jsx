"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useBlogStore } from "@/store/useBlogStore";
import { motion } from "framer-motion";

const BlogSection = () => {
  const { blogs, loading, error, fetchAllBlogs } = useBlogStore();

  useEffect(() => {
    fetchAllBlogs();
  }, [fetchAllBlogs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="py-16 px-8 md:px-20 lg:px-26"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Stay Updated with Our Tips & Service News!
          </h1>
        </div>
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-green-500 dark:text-green-400">Our Blog</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Stay informed with our latest cleaning tips, service updates, expert advice on maintaining an immaculate home
          </p>
        </div>
      </div>

      {/* Blog Posts Section */}
      <section className="py-8">
        <div className="container mx-auto">
          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading blogs...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogs.map((blog, index) => {
                const imageUrl =
                  Array.isArray(blog.images) && blog.images.length > 0
                    ? blog.images[0]
                    : typeof blog.images === "string" && blog.images.trim() !== ""
                    ? blog.images
                    : "/images/placeholder.jpg";

                return (
                  <motion.div
                    key={index}
                    href={`/blogs/${blog.id}`}
                    className="group"
                    variants={cardVariants}
                  >
                    <div className="bg-white dark:bg-gray-700 shadow-md rounded-2xl border border-gray-200 dark:border-gray-600 p-4 flex flex-col items-start transition-transform duration-300 transform hover:scale-105">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {blog.description}
                      </p>
                      <div className="relative w-full h-56 rounded-xl overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={blog.title}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-xl object-top transition duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default BlogSection;