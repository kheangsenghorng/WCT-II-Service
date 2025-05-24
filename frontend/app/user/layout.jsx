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

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-autu dark:bg-gray-900 ">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Userlayout;
