import HeroSectionHome from "../components/HeroSectionHome";
import FeaturesSection from "../components/FeaturesSection";
import CampusMapSection from "../components/CampusMapSection";
import FooterHome from "../components/FooterHome";
import HomeNavbar from "../components/HomeNavbar";

export default function Home() {
  return (
    <div className="w-full bg-dark-bg text-white overflow-x-hidden">
      <HomeNavbar />
      <HeroSectionHome />
      <FeaturesSection />
      <CampusMapSection />
      <FooterHome />
    </div>
  );
}
