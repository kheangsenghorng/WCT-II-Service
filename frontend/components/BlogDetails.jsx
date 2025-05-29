"use client";

import React, { useEffect } from "react";
import { useBlogStore } from "@/store/useBlogStore";

const BlogDetails = ({ id }) => {
  const {
    selectedBlog,
    fetchBlogById,
    loading,
    error,
  } = useBlogStore();

  useEffect(() => {
    if (id) {
      console.log("Fetching blog with ID:", id);
      fetchBlogById(id);
    }
  }, [id, fetchBlogById]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!selectedBlog) return <div className="text-center py-10">No blog found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog Details</h1>
          <nav className="text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Blog Details</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 md:px-20 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {selectedBlog.image && (
            <div className="relative h-80 md:h-96">
              <img
                src={selectedBlog.image}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{selectedBlog.title}</h2>

            <div className="flex items-center text-sm text-gray-600 mb-8 border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">A</span>
                </div>
                <span className="ml-2">By {selectedBlog.author || "Admin"}</span>
              </div>
              <span className="mx-3 text-gray-400">•</span>
              <span>{selectedBlog.date || "Unknown date"}</span>
              <span className="mx-3 text-gray-400">•</span>
              <span>{selectedBlog.readTime || "5 min read"}</span>
            </div>

            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
