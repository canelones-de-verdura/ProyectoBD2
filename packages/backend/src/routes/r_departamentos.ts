import { Router } from 'express'

export const departamentosRouter = Router()

departamentosRouter.get('/', (req, res) => {
  // TODO: Implement get all departamentos logic
  res.status(200).json({ data: [] })
})

departamentosRouter.get('/:numero', (req, res) => {
  // TODO: Implement get departamento by numero logic
  res.status(200).json({})
})

departamentosRouter.get('/:numero/establecimientos', (req, res) => {
  // TODO: Implement get establecimientos by departamento logic
  res.status(200).json({ data: [] })
})
