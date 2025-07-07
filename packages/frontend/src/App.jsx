// src/App.jsx
import { useState } from 'react'
import { ToastContainer } from 'react-toastify';

import { AuthContext, AuthProvider } from './shared/context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HabilitarCircuitoPage from './features/habilitarCircuito/pages/HabilitarPage';
import { Navigate } from 'react-router-dom';
import LayoutedRoute from './shared/navitation/LayoutedRoute';
import BuscarVotantesPage from './features/PanelAdmin/BuscarVotante/pages/BuscarVotantesPage';
import CerrarCircuitoPage from './features/PanelAdmin/cerrarcircuito/CerrarPage';
import VotarPage from './features/voto/pages/VotarPage';
import EscrutinioCircuitoPage from './features/escrutinioCircuito/pages/EscrutinioCircuitoPage';
import EscrutinioFinalPage from './features/escrutinioTotal/pages/EscrutinioTotal';
import { ElectionProvider } from './shared/context/EleccionContext';

// Nuevas importaciones para la Corte
import CorteLoginPage from './features/auth/Corte/Pages/CorteLoginPage';
import CorteDashboardPage from './features/auth/Corte/Pages/CorteDashboardPage';


import './App.css'
import UnAuthRoute from './shared/navitation/UnAuthRoute'
import LoginPage from './features/auth/pages/LoginPage'

function App() {

  return (
    <ElectionProvider>
      <AuthProvider>
        <BrowserRouter>
            <ToastContainer />
          <Routes>
            {/* Rutas sin autenticación (o con autenticación específica) */}
            <Route element={<UnAuthRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/Corte" element={<CorteLoginPage />} /> {/* <-- Nueva ruta de login para la Corte */}
            </Route>

            {/* Rutas que usan el LayoutedRoute (con Navbar) */}
            <Route element={<LayoutedRoute />}>
              <Route path="/" element={<Navigate to="/inicio" />} />
              <Route path="/votantes" element={<BuscarVotantesPage />} />
              <Route path="/circuito" element={<CerrarCircuitoPage />} />
              <Route path="/votar/:votanteId/:tipoVoto" element={<VotarPage />} />
            </Route>
            <Route path="/inicio" element={<HabilitarCircuitoPage />} />
            <Route path="/EscrutinioCircuito" element={<EscrutinioCircuitoPage />} />
            <Route path="/EscrutinioFinal" element={<EscrutinioFinalPage />} />
            <Route path="/CorteDashboard" element={<CorteDashboardPage />} /> {/* <-- Nueva ruta del dashboard de la Corte */}

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ElectionProvider>

  )
}

export default App