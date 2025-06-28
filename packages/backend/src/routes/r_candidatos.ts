import { Router } from 'express'

export const candidatosRouter = Router()

candidatosRouter.get('/', (req, res) => {
  // TODO: Implement get all candidatos logic
  res.status(200).json({ data: [] })
})

candidatosRouter.get('/:ci', (req, res) => {
  // TODO: Implement get candidato by ci logic
  res.status(200).json({})
})
