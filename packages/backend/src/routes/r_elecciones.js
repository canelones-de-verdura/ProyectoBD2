import { Router } from "express";
import { protect } from "../middlewares/m_auth.js";
import { protect_eleccion } from "../middlewares/m_elecciones.js";
import {
  circ_close,
  circ_get_all,
  circ_get_one,
  circ_open,
  circ_resultados,
  circ_votar,
  el_get_all,
  el_get_one,
  el_resultados,
} from "../controllers/c_elecciones.js";
import { protect_circuito } from "../middlewares/m_circuitos.js";

export const eleccionesRouter = Router();

eleccionesRouter.get("/", protect, el_get_all);

eleccionesRouter.get("/:idEleccion", protect, protect_eleccion, el_get_one);

eleccionesRouter.get("/:idEleccion/resultados", el_resultados);

// eleccionesRouter.get("/:idEleccion/votos-observados");

// eleccionesRouter.post("/:idEleccion/votos-observados/:ciVotante");

eleccionesRouter.get(
  "/:idEleccion/circuitos",
  protect,
  protect_eleccion,
  circ_get_all,
);

eleccionesRouter.get(
  "/:idEleccion/circuitos/:numero",
  protect,
  protect_eleccion,
  protect_circuito,
  circ_get_one,
);

eleccionesRouter.post(
  "/:idEleccion/circuitos/:numero/abrir",
  protect,
  protect_eleccion,
  protect_circuito,
  circ_open,
);

eleccionesRouter.post(
  "/:idEleccion/circuitos/:numero/cerrar",
  protect,
  protect_eleccion,
  protect_circuito,
  circ_close,
);

eleccionesRouter.post(
  "/:idEleccion/circuitos/:numero/votar",
  protect,
  protect_eleccion,
  protect_circuito,
  circ_votar,
);

eleccionesRouter.get(
  "/:idEleccion/circuitos/:numero/resultados",
  protect,
  protect_eleccion,
  protect_circuito,
  circ_resultados,
);
