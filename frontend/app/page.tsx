"use client"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
// import ServiceSection from '@/components/ServicesSection'
import HeroSection from '@/components/HeroSection'
import WelcomeSection from '@/components/WelcomeSection'
// import HighQuality from '@/components/High-Quality'
export default function Home () {
  return (
    <div>
      <Navbar  />
     <div >
     <HeroSection />
     </div>
     <div>
      <WelcomeSection />
     </div>
     {/* <div>
     <ServiceSection />
     </div> */}
     {/* <div>
      <HighQuality />
     </div> */}
      <Footer />
    </div>
  )
}