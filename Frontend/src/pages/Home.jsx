import React from "react";
import Navbar from "../components/NavBar";
import CampusMap from "../components/CampusMap";
import BuildingModal from "../components/BuildingModal";
import { useState, useEffect } from "react";

export default function Home() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // ESC key to close modals
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
      <Navbar />

      {/* Main */}
      <div className="main-container">
        <div className="content-grid">
          <div className="left-content">
            {/* Map */}
            <CampusMap onBuildingClick={setSelectedBuilding} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedBuilding !== null && (
        <BuildingModal
          buildingId={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
        />
      )}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </>
  );
}
