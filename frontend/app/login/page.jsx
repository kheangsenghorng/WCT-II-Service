"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Facebook, Eye, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify"; // Import toast

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Clear any previous success message

    try {
      const res = await login(email, password); // { token, user, message }
      console.log("Login response:", res);

      const user = res.user;

      // Show success message
      setSuccessMessage("Login ...");

      setTimeout(() => {
        const { role, id } = user;

        if (!role || !id) {
          throw new Error("Missing user information.");
        }

        if (role === "admin") {
          router.push(`/admin/${id}/dashboard`); // Redirect to admin dashboard
        } else if (role === "owner") {
          router.push(`/owner/${id}/dashboard`);
        } else if (role === "staff") {
          router.push(`/staff/${id}/dashboard`); // Redirect to staff dashboard
        } else {
          router.push(`/profile/${id}/myprofile`); // Default redirect to profile
        }
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
      toast?.error?.(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center">
              {/* Spinner Animation */}
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent shadow-md"></div>
              {/* Loading Text */}
              <p className="mt-4 text-green-600 font-medium text-xl">
                Logging in...
              </p>
            </div>
          </div>
        )}

        {/* Success Message Overlay */}
        {successMessage && (
          <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 transform transition-all animate-fade-in max-w-md mx-auto">
              {/* Success Icon */}
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* Success Message Text */}
              <span className="text-gray-800 text-lg font-semibold">
                {successMessage}
              </span>
            </div>
          </div>
        )}

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
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-orange-500 hover:underline"
                >
                  Create Now
                </Link>
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
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
