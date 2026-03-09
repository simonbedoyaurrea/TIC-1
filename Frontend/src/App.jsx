import Login from "./pages/Login";
import AlertForm from "./components/AlertForm";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Bloque from './pages/Bloque'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/alert" element={<AlertForm />} />
        <Route path="/bloque/:idBloque" element={<Bloque />}/>
      </Routes>
    </div>
  );
}
