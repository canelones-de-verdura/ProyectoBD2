import { Router } from "express";

export const eleccionesRouter = Router();

eleccionesRouter.get("/");

eleccionesRouter.get("/:idEleccion");

eleccionesRouter.get("/:idEleccion/resultados");

eleccionesRouter.get("/:idEleccion/votos-observados");

eleccionesRouter.post("/:idEleccion/votos-observados/:ciVotante");

eleccionesRouter.get("/:idEleccion/circuitos");

eleccionesRouter.get("/:idEleccion/circuitos/:numero");

eleccionesRouter.post("/:idEleccion/circuitos/:numero/abrir");

eleccionesRouter.post("/:idEleccion/circuitos/:numero/cerrar");

eleccionesRouter.post("/:idEleccion/circuitos/:numero/votar");

eleccionesRouter.get("/:idEleccion/circuitos/:numero/resultados");
