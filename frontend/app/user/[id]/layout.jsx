"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";


const Userlayout = ({ children }) => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <Navbar id={id} />
      {/* Content with Sidebar and Main */}
      <div className="flex flex-1 px-4 md:px-10 py-5 space-x-6">

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-autu dark:bg-gray-900 p-4 md:p-8 rounded-xl shadow-sm">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Userlayout;
