import { Router } from 'express'

export const eleccionesRouter = Router()

eleccionesRouter.get('/', (req, res) => {
  // TODO: Implement get all elecciones logic
  res.status(200).json({ data: [] })
})

eleccionesRouter.get('/:id', (req, res) => {
  // TODO: Implement get eleccion by id logic
  res.status(200).json({})
})

eleccionesRouter.get('/:idEleccion/circuitos', (req, res) => {
  // TODO: Implement get circuitos by eleccion logic
  res.status(200).json({ data: [] })
})

eleccionesRouter.get('/:idEleccion/circuitos/:numero', (req, res) => {
  // TODO: Implement get circuito by numero logic
  res.status(200).json({})
})

eleccionesRouter.get('/:idEleccion/circuitos/:numero/resultados', (req, res) => {
  // TODO: Implement get resultados by circuito logic
  res.status(200).json({})
})

eleccionesRouter.post('/:idEleccion/circuitos/:numero/cerrar', (req, res) => {
  // TODO: Implement cerrar circuito logic
  res.status(200).json({})
})

eleccionesRouter.post('/:idEleccion/circuitos/:numero/votar', (req, res) => {
  // TODO: Implement votar logic
  res.status(201).json({})
})

eleccionesRouter.get('/:idEleccion/votos-observados', (req, res) => {
  // TODO: Implement get votos observados logic
  res.status(200).json({ data: [] })
})

eleccionesRouter.post('/:idEleccion/votos-observados/:ciVotante', (req, res) => {
  // TODO: Implement post voto observado logic
  res.status(200).json({})
})

eleccionesRouter.get('/:idEleccion/resultados', (req, res) => {
  // TODO: Implement get resultados by eleccion logic
  res.status(200).json({})
})
