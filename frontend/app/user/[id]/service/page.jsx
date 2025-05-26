import FeaturedCategories from "@/components/FeaturedCategories";
import Features from "@/components/Features";
// import ServicesForPage from "@/components/ServicesForPage";
import HightQuility from "@/components/HightQuility";

export default function ServicesSection() {
  return (
    <div>
      <div className="px-20">
      <FeaturedCategories />
      </div>
      {/* <ServicesForPage /> */}
      <HightQuility />
     <div className="py-10">
     <Features />
     </div>
    </div>
  );
}
