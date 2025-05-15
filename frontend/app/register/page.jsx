"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeOffIcon, Facebook } from "lucide-react";
import { useRouter } from "next/navigation";
import { request } from "@/util/request"; // adjust path if needed

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null); // null | true | false
  const [phoneAvailable, setPhoneAvailable] = useState(null); // null | true | false
  const [phoneChecking, setPhoneChecking] = useState(false);

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

    // Clear phone error when the user types phone number
    if (name === "phone") {
      setPhoneAvailable(null);
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

  // Add debounce for phone number checking
  const checkPhoneAvailability = debounce(async (phone) => {
    if (!phone) return;

    setPhoneChecking(true);
    setPhoneAvailable(null);

    try {
      const res = await request(`/check-phone?phone=${phone}`, "GET");

      if (res.available) {
        setPhoneAvailable(true);
        setErrors((prev) => ({ ...prev, phone: null }));
      } else {
        setPhoneAvailable(false);
        setErrors((prev) => ({
          ...prev,
          phone: ["The phone number has already been taken."],
        }));
      }
    } catch (error) {
      console.error("Phone check failed:", error);
    } finally {
      setPhoneChecking(false);
    }
  }, 600);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrors({});

    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      password_confirmation,
    } = form;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
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
            <div className="mb-4 flex space-x-4">
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
              </div>

              <div className="relative">
                <label
                  htmlFor="phone"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Phone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={() => checkPhoneAvailability(form.phone)}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {phoneChecking && (
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

                {phoneAvailable === true && !phoneChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    ✔
                  </div>
                )}

                {phoneAvailable === false && !phoneChecking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                    ✖
                  </div>
                )}

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    The phone number has already{" "}
                  </p>
                )}
              </div>

              {/* Other fields here... */}

              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-600 mb-1"
                >
                  email *
                </label>
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
                <p className="text-red-500 text-sm mt-1">
                  The email has already{""}
                </p>
              )}
   <div className="mb-4 flex space-x-4">
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium rounded-lg border border-blue-200 transition"
                >
                  <Facebook size={20} className="text-blue-600" />
                  Continue with Facebook
                </button>

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
