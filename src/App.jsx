import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import Results from './pages/Results';
import LaboratorioHub from './pages/LaboratorioHub';
import Recursos from './pages/Recursos';
import Exam from './pages/Exam';
import Sesiones from './pages/Sesiones';
import Foro from './pages/Foro';
import Evidencias from './pages/Evidencias';
import Corazon from './pages/simulations/Corazon';
import Sangre from './pages/simulations/Sangre';
import Pulmones from './pages/simulations/Pulmones';
import Cerebro from './pages/simulations/Cerebro';
import SistemaCirculatorioCompleto from './pages/simulations/SistemaCirculatorioCompleto';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/landing" element={<Landing />} />
          <Route path="/sesiones" element={<Sesiones />} />
          <Route path="/foro/:session" element={<Foro />} />
          <Route path="/evidencias" element={<Evidencias />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/laboratorio" element={<LaboratorioHub />} />
          <Route path="/laboratorio/corazon" element={<Corazon />} />
          <Route path="/laboratorio/sangre" element={<Sangre />} />
          <Route path="/laboratorio/pulmones" element={<Pulmones />} />
          <Route path="/laboratorio/cerebro" element={<Cerebro />} />
          <Route path="/laboratorio/sistema-circulatorio" element={<SistemaCirculatorioCompleto />} />
          <Route path="/laboratorio/:id/evaluacion" element={<Exam />} />
          <Route path="/pretest" element={<Exam examId="pretest" />} />
          <Route path="/postest" element={<Exam examId="postest" />} />
          <Route path="/recursos" element={<Recursos />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<UsersList />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
