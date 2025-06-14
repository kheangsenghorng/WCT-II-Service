"use client";

import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-teal-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Fancy 404 Number with Glow Effect */}
          <div className="space-y-6 relative">
            <div className="relative">
              <h1 className="text-9xl font-black bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent select-none drop-shadow-2xl">
                404
              </h1>
              <div className="absolute inset-0 text-9xl font-black text-emerald-500/20 blur-sm select-none">
                404
              </div>
            </div>

            {/* Animated Sparkles */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div className="absolute top-8 right-8">
              <Sparkles className="w-4 h-4 text-green-400 animate-pulse delay-300" />
            </div>
            <div className="absolute top-12 left-8">
              <Sparkles className="w-5 h-5 text-teal-400 animate-pulse delay-700" />
            </div>

            {/* Gradient Line */}
            <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 mx-auto rounded-full shadow-lg"></div>
          </div>
          {/* Error Message with Glass Effect */}
          <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-8 border border-white/20 shadow-2xl space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              Oops! Page Not Found
            </h2>
            <p className="text-slate-700 leading-relaxed text-lg">
              It seems like you've wandered into uncharted territory. The page
              you're looking for has vanished into the digital void.
            </p>
          </div>
          {/* Fancy Search Icon with Floating Animation */}
          <div className="flex justify-center">
            <div className="relative animate-bounce">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/50">
                <Search className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
          </div>{" "}
          {/* Enhanced Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                size="lg"
              >
                <Home className="w-5 h-5 mr-3" />
                Return to Home
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm bg-white/50"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Go Back
            </Button>
          </div>
          {/* Enhanced Help Text */}
          <div className="pt-6">
            <div className="backdrop-blur-sm bg-white/20 rounded-xl p-4 border border-white/30">
              <p className="text-slate-600 font-medium">
                Still lost? Our{" "}
                <Link
                  href="/contact"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                >
                  support wizards
                </Link>{" "}
                are here to help! ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
