import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
export default function Home() {
  return (
    <>
      <Navbar />
      <div>
        <HeroSection />
      </div>
      <div>
        <WelcomeSection />
      </div>
      <Footer />
    </>
  );
}
