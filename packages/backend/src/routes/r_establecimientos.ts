import { Router } from 'express'

export const establecimientosRouter = Router()

establecimientosRouter.get('/:id', (req, res) => {
  // TODO: Implement get establecimiento by id logic
  res.status(200).json({})
})
