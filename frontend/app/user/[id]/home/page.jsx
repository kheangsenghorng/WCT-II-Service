// UserHomePage.js
"use client";
import React from "react";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
import ServicesSection from "@/components/ServicesSection";
import HightQuility from "@/components/HightQuility";
import ExpertTeamSection from "@/components/ExpertTeamSection";
import FeedbackSection from "@/components/FeedbackSection";
import FindUs from "@/components/FindUs";
import ContactInfo from "@/components/ContactInfo";
import BlogSection from "@/components/BlogSection";


export default function UserHomePage() {
  return (
    <div>
      <HeroSection />
      <WelcomeSection />
      <ServicesSection />
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
