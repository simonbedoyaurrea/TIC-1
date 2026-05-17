import HeroSectionHome from "../components/HeroSectionHome";
import FeaturesSection from "../components/FeaturesSection";
import CampusMapSection from "../components/CampusMapSection";
import FooterHome from "../components/FooterHome";

export default function Home() {
  return (
    <div className="w-full bg-dark-bg text-white overflow-x-hidden">
      <HeroSectionHome />
      <FeaturesSection />
      <CampusMapSection />
      <FooterHome />
    </div>
  );
}
