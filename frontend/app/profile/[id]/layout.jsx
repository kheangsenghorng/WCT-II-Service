"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import FancySidebar from "@/components/FancySidebar";

const OwnerLayout = ({ children }) => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-pink-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Top Navigation */}
      <Navbar id={id} />

      {/* Content with Sidebar and Main */}
      <div className="flex flex-1 px-2 md:px-4 lg:px-10 py-3 md:py-5 gap-3 md:gap-6">
        {/* Sidebar - Responsive width */}
        <aside className="flex-shrink-0">
          <FancySidebar id={id} />
        </aside>

        {/* Main Content - Responsive and flexible */}
        <main className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-3 md:p-4 lg:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OwnerLayout;
