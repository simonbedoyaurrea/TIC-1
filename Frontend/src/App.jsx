import Login from "./pages/Login";
import AlertForm from "./components/AlertForm";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Bloque from "./pages/Bloque";
import { FormularioPage } from "./pages/HorarioPrueba";
import CargaDatosHorario from "./pages/CargaDatosHorario";
import AdminDashboard from "./pages/AdminDashboard";
import Aula from './pages/Aula'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/alert" element={<AlertForm />} />
        <Route path="/bloque/:idBloque" element={<Bloque />} />
        <Route path="/prueba" element={<FormularioPage />} />
        <Route path="/horario/carga" element={<CargaDatosHorario />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/aula/:idAula" element={<Aula/>}/>
      </Routes>
    </div>
  );
}
