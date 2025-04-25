"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { request } from "@/util/request"; // adjust path if needed

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null); // null | true | false

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form state with the new value
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear email error when the user types email
    if (name === "email") {
      setEmailAvailable(null);
    }

    // Password and password_confirmation validation
    if (name === "password" || name === "password_confirmation") {
      setErrors((prev) => {
        const newErrors = { ...prev };

        // Check for password match
        if (form.password !== form.password_confirmation) {
          newErrors.password_confirmation = ["Passwords do not match."];
        } else {
          delete newErrors.password_confirmation; // Clear error if passwords match
        }

        // Check for password strength
        if (form.password.length < 8) {
          newErrors.password = ["Password must be at least 8 characters long."];
        } else {
          delete newErrors.password; // Clear error if password is long enough
        }

        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const { first_name, last_name, email, password, password_confirmation } =
      form;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !password_confirmation
    ) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await request("/register", "POST", form);
      router.push("/login");
      setMessage("User registered successfully!");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };
  const checkEmailAvailability = debounce(async (email) => {
    if (!email) return;

    setEmailChecking(true);
    setEmailAvailable(null);

    try {
      const res = await request(`/check-email?email=${email}`, "GET");

      if (res.available) {
        setEmailAvailable(true);
        setErrors((prev) => ({ ...prev, email: null }));
      } else {
        setEmailAvailable(false);
        setErrors((prev) => ({
          ...prev,
          email: ["The email has already been taken."],
        }));
      }
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setEmailChecking(false);
    }
  }, 600);

  return (
    <div className="min-h-screen flex items-center justify-center p-20 bg-gray-50">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-sm overflow-hidden flex">
        {/* Left side with illustration */}
        <div className="hidden md:flex md:w-1/2 relative bg-[#e8f4f5] items-center justify-center p-8">
          <div className="w-full max-w-md aspect-square rounded-full bg-[#cce6ea] flex items-center justify-center overflow-hidden">
            <Image
              src="/images/image.png"
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

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm text-gray-600 mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="first_name"
                  type="text"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="First name"
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
                  name="last_name"
                  type="text"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => checkEmailAvailability(form.email)}
                  placeholder="email@gmail.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                />
                {emailChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                  </div>
                )}
                {emailAvailable === true && !emailChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    ✔
                  </div>
                )}
                {emailAvailable === false && !emailChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    ✖
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}

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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password_confirmation[0]}
                  </p>
                )}
              </div>

              {message && (
                <p className="text-sm text-center text-red-500 mt-2">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <div className="relative flex items-center justify-center mt-6 mb-6">
                <div className="absolute w-full border-t border-gray-300"></div>
                <div className="relative bg-white px-4 text-sm text-gray-500">
                  Or
                </div>
              </div>

              {/* Social buttons */}
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-[#f0f4f9] hover:bg-gray-100 flex items-center justify-center gap-2 transition duration-200"
              >
                {/* Facebook SVG */}
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
                {/* Google SVG */}
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
