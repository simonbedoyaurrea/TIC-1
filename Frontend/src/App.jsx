import { Routes, Route, Navigate } from 'react-router-dom'
import CargaDatosHorario from './pages/CargaDatosHorario'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/horario/carga" replace />} />
      <Route path="/horario/carga" element={<CargaDatosHorario />} />
    </Routes>
  )
}

export default App
