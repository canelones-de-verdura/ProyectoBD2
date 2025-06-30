import { useState } from 'react'

import './App.css'
import UnAuthRoute from './shared/navitation/UnAuthRoute'
import LoginPage from './features/auth/pages/LoginPage'

function App() {

  return (
    <Route element={<UnAuthRoute />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>
  )
}

export default App
