import { Router } from "express";

export const eleccionesRouter = Router();

eleccionesRouter.get("/"); // pronto

eleccionesRouter.get("/:idEleccion"); // pronto

eleccionesRouter.get("/:idEleccion/resultados");

eleccionesRouter.get("/:idEleccion/votos-observados");

eleccionesRouter.post("/:idEleccion/votos-observados/:ciVotante");

eleccionesRouter.get("/:idEleccion/circuitos"); // pronto

eleccionesRouter.get("/:idEleccion/circuitos/:numero"); // pronto

eleccionesRouter.post("/:idEleccion/circuitos/:numero/abrir"); // pronto

eleccionesRouter.post("/:idEleccion/circuitos/:numero/cerrar"); // pronto

eleccionesRouter.post("/:idEleccion/circuitos/:numero/votar");

eleccionesRouter.get("/:idEleccion/circuitos/:numero/resultados");
