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
          <Route path="/login" element={<Login />} />

          <Route
            path="/planeacion"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <PlaneacionHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/alertas/nueva"
            element={
              <ProtectedRoute
                rolesPermitidos={["ESTUDIANTE", "DOCENTE", "ADMINISTRATIVO"]}
              >
                <AlertForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alertas"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <ReportesDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute rolesPermitidos={["ESTUDIANTE", "DOCENTE"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planeacion"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <PlaneacionHome />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Home />} />
          <Route
            path="/planeacion/carga/optimizador"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <CargaDatosHorario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planeacion/optimizador"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <OptimizadorCalendario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/planeacion/simulador"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <SimuladorHorario />
              </ProtectedRoute>
            }
          />
          <Route path="/planeacion/alertas
          " element={<ReportesDashboard />} />
          <Route
            path="/planeacion/carga/simulador"
            element={
              <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
                <CargaDatosSimulador />
              </ProtectedRoute>
            }
          />

          {/* ───────── BLOQUES / AULAS ───────── */}
          <Route path="/bloque/:idBloque" element={<Bloque />} />
          <Route path="/aula/:idAula" element={<Aula />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}
