// src/App.jsx
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { ElectionProvider } from './shared/context/EleccionContext';

import LayoutedRoute    from './shared/navitation/LayoutedRoute';
import ProtectedRoute   from './shared/navitation/ProtectedRoute';
import UnAuthRoute      from './shared/navitation/UnAuthRoute';

import LoginPage              from './features/auth/pages/LoginPage';
import CorteLoginPage         from './features/auth/Corte/Pages/CorteLoginPage';
import CorteDashboardPage     from './features/auth/Corte/Pages/CorteDashboardPage';

import HabilitarCircuitoPage  from './features/habilitarCircuito/pages/HabilitarPage';
import BuscarVotantesPage     from './features/PanelAdmin/BuscarVotante/pages/BuscarVotantesPage';
import CerrarCircuitoPage     from './features/PanelAdmin/cerrarcircuito/CerrarPage';
import VotarPage              from './features/voto/pages/VotarPage';
import EscrutinioCircuitoPage from './features/escrutinioCircuito/pages/EscrutinioCircuitoPage';
import EscrutinioFinalPage    from './features/escrutinioTotal/pages/EscrutinioTotal';

import './App.css';

function App() {
  return (
    <ElectionProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            {/* 1️⃣ Rutas públicas / sólo sin sesión */}
            <Route element={<UnAuthRoute />}>
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/Corte"  element={<CorteLoginPage />} />
            </Route>

            {/* 2️⃣ Grupo con layout NAVBAR (protegido dentro del propio LayoutedRoute) */}
            <Route element={<ProtectedRoute />}>
            <Route element={<LayoutedRoute />}>
              {/* redirección raíz */}
              <Route path="/" element={<Navigate to="/inicio" />} />

              <Route path="/votantes" element={<BuscarVotantesPage />} />
              <Route path="/circuito" element={<CerrarCircuitoPage />} />
              <Route path="/votar/:votanteId/:tipoVoto" element={<VotarPage />} />
            </Route>

            {/* 3️⃣ Páginas protegidas sin layout */}
              <Route path="/inicio"               element={<HabilitarCircuitoPage />} />
              <Route path="/EscrutinioCircuito"   element={<EscrutinioCircuitoPage />} />
              <Route path="/EscrutinioFinal"      element={<EscrutinioFinalPage />} />
              <Route path="/CorteDashboard"       element={<CorteDashboardPage />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ElectionProvider>
  );
}

export default App;
