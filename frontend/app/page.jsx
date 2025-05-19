"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
// import ServicesSection from "@/components/ServicesSection";
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
    <div>
      <Navbar />
      {/* <ServicesSection /> */}
      <Footer />
    </div>
  );
}
