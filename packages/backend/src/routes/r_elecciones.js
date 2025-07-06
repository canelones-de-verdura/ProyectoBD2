import { Router } from "express";
import {
  el_get_all,
  el_get_one,
  circ_get_all,
  circ_get_one,
  circ_open,
  circ_close,
} from "../controllers/c_elecciones.js";

export const eleccionesRouter = Router();

eleccionesRouter.get("/", el_get_all);
eleccionesRouter.get("/:idEleccion", el_get_one);
eleccionesRouter.get("/:idEleccion/circuitos", circ_get_all);
eleccionesRouter.get("/:idEleccion/circuitos/:numero", circ_get_one);
eleccionesRouter.post("/:idEleccion/circuitos/:numero/abrir", circ_open);
eleccionesRouter.post("/:idEleccion/circuitos/:numero/cerrar", circ_close);
