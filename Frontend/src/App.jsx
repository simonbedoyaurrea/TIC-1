import Login from "./pages/Login";
import AlertForm from "./components/AlertForm";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Bloque from "./pages/Bloque";
import Aula from "./pages/Aula";
import { FormularioPage } from "./pages/HorarioPrueba";
import CargaDatosHorario from "./pages/CargaDatosHorario";
import AdminDashboard from "./pages/AdminDashboard";
import OptimizadorCalendario from "./pages/OptimizadorCalendario";
import ModalNuevaMateria from "./components/ModalNuevaMateria";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaneacionHome from "./pages/PlaneacionHome";
import CargaDatosSimulador from "./pages/CargaDatosSimulador";
import SimuladorHorario from "./pages/SimuladorHorario";
import HomeNavbar from "./components/HomeNavbar";

export default function App() {
  return (
    <div>
      <HomeNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/planeacion" element={<PlaneacionHome />} />
        <Route
          path="/planeacion/carga/simulador"
          element={<CargaDatosSimulador />}
        />
        <Route
          path="/alertas/nueva"
          element={
            <ProtectedRoute rolesPermitidos={["ESTUDIANTE", "DOCENTE"]}>
              <AlertForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alertas/dashboard"
          element={
            <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/"
          element={
            <ProtectedRoute rolesPermitidos={["ESTUDIANTE", "DOCENTE"]}>
              <Home />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/" element={<Home />} />
        {/* <Route
          path="/planeacion/carga/optimizador"
          element={
            <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
              <CargaDatosHorario />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/planeacion/carga/optimizador"
          element={<CargaDatosHorario />}
        />

        <Route path="/planeacion/simulador" element={<SimuladorHorario />} />

        {/* <Route
          path="/planeacion/optimizador"
          element={
            <ProtectedRoute rolesPermitidos={["ADMINISTRATIVO"]}>
              <OptimizadorCalendario />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/planeacion/optimizador"
          element={<OptimizadorCalendario />}
        />

        <Route path="/bloque/:idBloque" element={<Bloque />} />
        <Route path="/aula/:idAula" element={<Aula />} />
        <Route path="/modal" element={<ModalNuevaMateria />} />
      </Routes>
    </div>
  );
}
