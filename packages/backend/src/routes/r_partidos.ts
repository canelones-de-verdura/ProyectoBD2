import { Router } from 'express'

export const partidosRouter = Router()

partidosRouter.get('/', (req, res) => {
  // TODO: Implement get all partidos logic
  res.status(200).json({ data: [] })
})

partidosRouter.get('/:nombre', (req, res) => {
  // TODO: Implement get partido by nombre logic
  res.status(200).json({})
})
