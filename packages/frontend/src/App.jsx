import { useState } from 'react'
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


import './App.css'
import UnAuthRoute from './shared/navitation/UnAuthRoute'
import LoginPage from './features/auth/pages/LoginPage'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<UnAuthRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<LayoutedRoute />}>
            <Route path="/inicio" element={<HabilitarCircuitoPage />} />
            <Route path="/" element={<Navigate to="/inicio" />} />
            <Route path="/votantes" element={<BuscarVotantesPage />} />
            <Route path="/circuito" element={<CerrarCircuitoPage />} />
            <Route path="/votar/:votanteId/:tipoVoto" element={<VotarPage />} />
          </Route>
          <Route path="/EscrutinioCircuito" element={<EscrutinioCircuitoPage />} /> {/* <--- Nueva ruta */}
                      <Route path="/EscrutinioFinal" element={<EscrutinioFinalPage />} /> {/* <--- Nueva ruta */}

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

