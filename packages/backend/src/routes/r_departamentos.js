import { Router } from "express";
import {
  deps_get_all,
  deps_get_establecimientos,
  deps_get_one,
} from "../controllers/c_departamentos.js";
import { protect } from "../middlewares/m_auth.js";
import { protect_eleccion } from "../middlewares/m_elecciones.js";
import { protect_circuito } from "../middlewares/m_circuitos.js";

export const departamentosRouter = Router();

departamentosRouter.get(
  "/:numero/establecimientos",
  protect,
  deps_get_establecimientos,
);

departamentosRouter.get("/:numero", protect, deps_get_one);

departamentosRouter.get("/", protect, deps_get_all);
