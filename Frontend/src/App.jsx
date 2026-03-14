import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard'
import CargaDatosHorario from './pages/CargaDatosHorario'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/horario/carga" element={<CargaDatosHorario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App