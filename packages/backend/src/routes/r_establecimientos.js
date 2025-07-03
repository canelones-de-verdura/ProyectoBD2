import { Router } from "express";
import { ests_get_one } from "../controllers/c_establecimientos";
import { protect } from "../middlewares/m_auth";
import { protect_eleccion } from "../middlewares/m_elecciones";

export const establecimientosRouter = Router();

establecimientosRouter.get("/:id", protect, ests_get_one);
