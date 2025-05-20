// UserHomePage.js
"use client";
import React from "react";
import { useParams } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WelcomeSection from "@/components/WelcomeSection";
import HightQuility from "@/components/HightQuility";
import BlogSection from "@/components/BlogSection";
import ExpertTeamSection from "@/components/ExpertTeamSection";
import FeedbackSection from "@/components/FeedbackSection";
import FindUs from "@/components/FindUs";
import ContactInfo from "@/components/ContactInfo";
export default function UserHomePage() {
  const { id } = useParams();

  return (
    <div>
      <HeroSection />
      <WelcomeSection />
      <ServicesSection id={id} />
      <HightQuility/>
      <BlogSection/>
      <ExpertTeamSection/>
      <FeedbackSection />
      <div className="py-16 px-4 md:px-5 lg:px-24 ">
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <FindUs />
        <ContactInfo />
      </div>
      </div>
      </div>
  );
}