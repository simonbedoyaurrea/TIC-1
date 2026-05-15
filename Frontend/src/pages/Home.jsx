import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import FuturisticBackground from "../components/FuturisticBackground";
import HeroSection from "../components/HeroSection";
import CampusMap from "../components/CampusMap";
import InteractiveSidebar from "../components/InteractiveSidebar";
import AIChat from "../components/AIChat";
import HolographicRadar from "../components/HolographicRadar";
import BuildingModal from "../components/BuildingModal";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/bloque/${id}`);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSelectedBuilding(null);
        setShowReport(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <FuturisticBackground />
      <Navbar />
      <HeroSection />

      {/* Main content */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-dark-bg/30 to-dark-bg/60 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left - Campus Map (spans 2 columns on desktop) */}
            <div className="lg:col-span-2">
              <CampusMap onBuildingClick={handleClick} />
            </div>

            {/* Right - Interactive Sidebar */}
            <div className="lg:col-span-1">
              <InteractiveSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Components */}
      <AIChat />
      <HolographicRadar />

      {/* Modals (mantener funcionalidad existente) */}
      {selectedBuilding !== null && (
        <BuildingModal
          buildingId={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
        />
      )}
    </>
  );
}
