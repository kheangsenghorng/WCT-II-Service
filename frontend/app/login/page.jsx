"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Eye } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-50 to-sky-100 p-8 flex items-center justify-center">
            <div className="relative w-64 h-64">
              <Image
                src="/images/cooking-mouse.png"
                alt="Cooking mouse mascot"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                Login
              </h1>
              <p className="text-center text-sm text-gray-600 mb-6">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-orange-500 hover:underline"
                >
                  Create Now
                </Link>
              </p>

              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm text-gray-600 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition duration-200"
                >
                  Login
                </button>

                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Forgot a password?
                  </Link>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-300 w-full"></div>
                  <div className="text-gray-500 text-sm bg-white px-4 absolute">
                    Or
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium rounded-md transition duration-200"
                >
                  <Facebook size={20} className="text-blue-600" />
                  Continue with Facebook
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 text-gray-800 font-medium rounded-md transition duration-200"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
