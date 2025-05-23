"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
import ServicesSection from "@/components/ServicesSection";
import HightQuility from "@/components/HightQuility";
// import BlogSection from "@/components/BlogSection";
import ExpertTeamSection from "@/components/ExpertTeamSection";
import FeedbackSection from "@/components/FeedbackSection";
import FindUs from "@/components/FindUs";
import ContactInfo from "@/components/ContactInfo";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const params = useParams() || {};
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const fetchUserById = useUserStore((state) => state.fetchUserById);
  useEffect(() => {
    const storedId = localStorage.getItem("userId");

    if (!storedId && id) {
      localStorage.setItem("userId", id);
      fetchUserById(id);
    } else if (storedId && storedId !== id) {
      fetchUserById(storedId);
    }
  }, [id, fetchUserById]);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <WelcomeSection />
      <ServicesSection id={id} />

      <HightQuility />
      {/* <BlogSection/> */}
      <ExpertTeamSection />
      <FeedbackSection />
      <div className="py-16 px-4 md:px-5 lg:px-24 ">
        <div className="grid md:grid-cols-2 gap-6 w-full">
          <FindUs />
          <ContactInfo />
        </div>
      </div>
      <Footer />
    </div>
  );
}
