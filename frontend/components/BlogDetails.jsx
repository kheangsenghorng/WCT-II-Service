
import React from 'react';

const BlogDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog Details
          </h1>
          <nav className="text-sm text-gray-600">
            <span className="hover:text-gray-900 transition-colors cursor-pointer">
              Home
            </span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Blog Details</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-80 md:h-96">
            <img
              src="/lovable-uploads/2c722c6d-11b8-489a-bc6e-c0f656ee0a5c.png"
              alt="Woman cleaning kitchen with modern appliances"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">

            {/* Article Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-6">
              The Ultimate Guide to Deep Cleaning Your Kitchen
            </h2>

            {/* Article Meta */}
            <div className="flex items-center text-sm text-gray-600 mb-8 border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">A</span>
                </div>
                <span className="ml-2">By Admin</span>
              </div>
              <span className="mx-3 text-gray-400">•</span>
              <span>March 15, 2024</span>
              <span className="mx-3 text-gray-400">•</span>
              <span>5 min read</span>
            </div>

            {/* Article Preview Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Keeping your kitchen spotless is essential for both hygiene and creating a pleasant cooking environment. 
                This comprehensive guide will walk you through professional cleaning techniques that will transform 
                your kitchen into a pristine space.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                From tackling stubborn grease stains to organizing your appliances, we'll cover everything you need 
                to know about deep cleaning your kitchen effectively and efficiently.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Professional cleaning techniques for all kitchen surfaces</li>
                <li>How to clean and maintain kitchen appliances</li>
                <li>Organization tips for maximum efficiency</li>
                <li>Eco-friendly cleaning solutions</li>
                <li>Time-saving cleaning schedules</li>
              </ul>


            </div>

          </div>
        </div>

        {/* Related Articles Preview */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-4">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Cleaning
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    More Cleaning Tips
                  </h4>
                  <p className="text-sm text-gray-600">
                    Discover more professional cleaning techniques...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;