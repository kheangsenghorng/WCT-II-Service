"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { fetchUserById } = useUserStore();

  useEffect(() => {
    const storedId = localStorage.getItem("userId");

    if (!storedId && id) {
      localStorage.setItem("userId", id);
      fetchUserById(id);
    } else if (storedId) {
      fetchUserById(storedId);
    }
  }, [id, fetchUserById]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar id={id} />
        {/* Your content here */}
        <HeroSection />
        <WelcomeSection />

      <Footer />
    </div>
  );
}
