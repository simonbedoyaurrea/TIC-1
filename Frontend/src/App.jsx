import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Bloque from "./pages/Bloque";
import Aula from "./pages/Aula";

import AlertForm from "./components/AlertForm";
import ModalNuevaMateria from "./components/ModalNuevaMateria";
import ProtectedRoute from "./components/ProtectedRoute";

import { FormularioPage } from "./pages/HorarioPrueba";

import PlaneacionHome from "./pages/PlaneacionHome";
import CargaDatosHorario from "./pages/CargaDatosHorario";
import CargaDatosSimulador from "./pages/CargaDatosSimulador";

import SimuladorHorario from "./pages/SimuladorHorario";
import OptimizadorCalendario from "./pages/OptimizadorCalendario";
import OptimizerInterface from "./pages/OptimizerInterface"; // Guía del optimizador

import HomeNavbar from "./components/HomeNavbar";
import ReportesDashboard from "./pages/ReportesDashboard";

import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        {/* <HomeNavbar /> */}
        <Routes>

          {/* ───────── LOGIN ───────── */}
          <Route path="/" element={<Home />} />

          {/* ───────── HOME ───────── */}
          <Route path="/login" element={<Login />} />

          {/* ───────── ALERTAS ───────── */}
          <Route
            path="/alertas/nueva"
            element={
              // <ProtectedRoute rolesPermitidos={["ESTUDIANTE", "DOCENTE"]}>
              <AlertForm />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/alertas"
            element={
              // <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
              <ReportesDashboard />
              // </ProtectedRoute>
            }
          />
        
          {/* ───────── PLANEACIÓN ───────── */}
          <Route path="/planeacion" element={<PlaneacionHome />} />

          <Route
            path="/planeacion/carga/simulador"
            element={<CargaDatosSimulador />}
          />

          <Route
            path="/planeacion/carga/optimizador"
            element={<CargaDatosHorario />}
          />

          <Route
            path="/planeacion/simulador" 
            element={<SimuladorHorario />} />

          <Route
            path="/planeacion/optimizador"
            element={<OptimizadorCalendario />}
          />

          {/* ───────── GUÍA ALGORITMO ───────── */}
          <Route
            path="/optimizador/guia"
            element={<OptimizerInterface />}
          />

          {/* ───────── BLOQUES / AULAS ───────── */}
          <Route path="/bloque/:idBloque" element={<Bloque />} />
          <Route path="/aula/:idAula" element={<Aula />} />

          {/* ───────── TESTING ───────── */}
          <Route path="/modal" element={<ModalNuevaMateria />} />

        </Routes>
      </div>
    </ThemeProvider> 
  );
}

// LISTO