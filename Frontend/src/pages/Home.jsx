import HeroSectionHome from "../components/HeroSectionHome";
import FeaturesSection from "../components/FeaturesSection";
import CampusMapSection from "../components/CampusMapSection";
import MetricsSection from "../components/MetricsSection";
import TeamSection from "../components/TeamSection";
import FooterHome from "../components/FooterHome";

export default function Home() {
  return (
    <div className="w-full bg-dark-bg text-white">
      <HeroSectionHome />
      <FeaturesSection />
      <CampusMapSection />
      <MetricsSection />
      <TeamSection />
      <FooterHome />
    </div>
  );
}
