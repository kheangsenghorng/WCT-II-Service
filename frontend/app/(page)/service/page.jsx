import FeaturedCategories from "@/components/FeaturedCategories";
import Features from "@/components/Features";
// import ServicesForPage from "@/components/ServicesForPage";
import HightQuility from "@/components/HightQuility";

export default function ServicesSection() {
  return (
    <div>
      <FeaturedCategories />
      {/* <ServicesForPage /> */}
      <HightQuility />
     <div className="py-10">
     <Features />
     </div>
    </div>
  );
}
