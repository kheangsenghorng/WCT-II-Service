import Link from "next/link";
import Image from "next/image";
import { EyeIcon } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-20 bg-gray-50">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm overflow-hidden flex">
        {/* Left side with illustration */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#e8f4f5] items-center justify-center p-8">
          <div className="w-full max-w-md aspect-square rounded-full bg-[#cce6ea] flex items-center justify-center overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="Bathroom illustration"
              width={400}
              height={400}
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1e3a5f] mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-[#f0923b] hover:underline">
                  Login
                </Link>
              </p>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm text-gray-600 mb-1"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="firstName"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="lastName"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

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
                  placeholder="email@gmail.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Toggle password visibility"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200"
              >
                Register
              </button>

              <div className="relative flex items-center justify-center mt-6 mb-6">
                <div className="absolute w-full border-t border-gray-300"></div>
                <div className="relative bg-white px-4 text-sm text-gray-500">
                  Or
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-[#f0f4f9] hover:bg-gray-100 flex items-center justify-center gap-2 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#3F51B5"
                    d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                  />
                  <path
                    fill="#FFF"
                    d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
                  />
                </svg>
                Continue with Facebook
              </button>

              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-[#f0f4f9] hover:bg-gray-100 flex items-center justify-center gap-2 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
