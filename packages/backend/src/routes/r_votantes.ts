import { Router } from 'express'

export const votantesRouter = Router()

votantesRouter.get('/', (req, res) => {
  // TODO: Implement get all votantes logic
  res.status(200).json({ data: [] })
})

votantesRouter.get('/:ci', (req, res) => {
  // TODO: Implement get votante by ci logic
  res.status(200).json({})
})
