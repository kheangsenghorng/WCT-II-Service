import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceSection from "@/components/ServicesSection";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
export default function Home() {
  return (
    <div>
      <Navbar />
      <div>
        <HeroSection />
      </div>
      <div>
        <WelcomeSection />
      </div>
      <div>
        <ServiceSection />
      </div>
      <Footer />
    </div>
  );
}
