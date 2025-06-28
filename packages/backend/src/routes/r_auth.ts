import { Router } from 'express'

export const authRouter = Router()

authRouter.post('/login', (req, res) => {
  // TODO: Implement login logic
  res.status(200).json({
    token: 'dummy-token',
    circuito: {
      numero: 1,
      idEleccion: 1,
      estado: 'abierto',
      url: '/api/elecciones/1/circuitos/1'
    }
  })
})
