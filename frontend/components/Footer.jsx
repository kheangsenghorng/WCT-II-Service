import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#1A2624] text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png" // Replace with your logo path
                alt="CleaningPro Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <div>
                <span className="text-xl font-bold text-white">Services Me</span>
                <p className="text-xs text-gray-400">Services Provider</p>
              </div>
            </div>
            <p className="text-sm">
              Stay updated with our latest cleaning tips, service updates, and helpful articles on maintaining a spotless home.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-green-500 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-green-500 transition-colors duration-200">
                  Services
                </a>
              </li>
              <li>
                <a href="/team" className="hover:text-green-500 transition-colors duration-200">
                  Our Team
                </a>
              </li>
            </ul>
          </div>

          {/* Know More */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Know More</h4>
            <ul className="space-y-2">
              <li>
                <a href="/support" className="hover:text-green-500 transition-colors duration-200">
                  Support
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-green-500 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-green-500 transition-colors duration-200">
                  Terms & conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Newsletter</h4>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email Goes here"
                className="bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-4 w-full focus:outline-none focus:border-green-500"
              />
              <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors duration-200 w-full">
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-xs">2024 "Procleaning" All Rights Received</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;