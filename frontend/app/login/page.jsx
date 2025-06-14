"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Facebook, Eye, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { user, token } = await login(email, password);

      if (!user || !token) {
        throw new Error("Invalid login response. Please try again.");
      }

      toast.success("Login successful!");

      setTimeout(() => {
        const { role, id } = user;
        const redirectMap = {
          admin: `/admin/${id}/dashboard`,
          owner: `/owner/${id}/dashboard`,
          staff: `/staff/${id}/dashboard`,
          user: `/user/${id}/home`,
        };

        router.push(redirectMap[role] || "/");
      }, 2500);
    } catch (err) {
      let msg = "Login failed. Please try again.";

      // Display specific error messages from backend
      if (err.message.toLowerCase().includes("email")) {
        msg = "Invalid login email. Please try again.";
      } else if (err.message.toLowerCase().includes("password")) {
        msg = "Invalid password. Please try again.";
      } else if (err.message.toLowerCase().includes("credentials")) {
        msg = "Invalid email or password.";
      } else {
        msg = err.message;
      }

      setError(msg);
      toast.error(msg);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl relative border border-gray-100">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-opacity-80 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent shadow-md"></div>
              <p className="mt-4 text-green-600 font-medium text-xl">
                Logging in...
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row">
          {/* Left Illustration */}
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

          {/* Login Form */}
          <div className="w-full md:w-1/2 p-10 md:p-12 lg:p-16 bg-white">
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
                {/* Email */}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Password */}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
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

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-offset-2 focus:ring-green-400 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center"
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

                {/* Forgot Password */}
                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <hr className="flex-grow border-gray-300" />
                  <span className="text-sm text-gray-400">OR</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                {/* Facebook Login */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium rounded-lg border border-blue-200 transition"
                >
                  <Facebook size={20} className="text-blue-600" />
                  Continue with Facebook
                </button>

                {/* Google Login */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium rounded-lg border border-blue-200 transition"
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
