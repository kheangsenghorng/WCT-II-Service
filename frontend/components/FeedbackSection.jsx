// components/TestimonialSection.js
"use client";
import { FaArrowLeft, FaArrowRight, FaQuoteRight } from "react-icons/fa";

const FeedbackSection = () => {
  return (
    <section className="py-12 px-4 md:px-22 bg-white text-gray-800">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2  gap-8 items-center">
        {/* Left Column */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Feedback About Their <br /> Experience With Us
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Read testimonials from our satisfied clients. See how our cleaning
            services have made a difference in their lives and homes.
          </p>

          <div className="flex space-x-4">
            <button className="w-10 h-10 rounded-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition">
              <FaArrowLeft />
            </button>
            <button className="w-10 h-10 rounded-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition">
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Right Column - Testimonial Card */}
        <div className="border-10 border-green-400  p-6 flex items-start space-x-6 shadow-sm">
          <img
            src="/images/feedback.png"
            alt="Robert Fox"
            className="w-40 h-42 rounded-2xl object-cover"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Robert Fox</h3>
                <p className="text-sm text-gray-500">Business Man</p>
              </div>
              <div className="text-green-500 text-3xl">
                <FaQuoteRight />
              </div>
            </div>
            <div className="text-yellow-500 mt-2 mb-2">★★★★★</div>
            <p className="text-sm text-gray-600">
              Excellent service! The team was punctual, thorough, and left my
              home sparkling clean. Highly recommend for anyone needing a
              reliable and detailed cleaning service
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default FeedbackSection;