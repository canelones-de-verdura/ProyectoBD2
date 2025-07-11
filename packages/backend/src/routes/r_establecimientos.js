import { Router } from "express";
import { ests_get_one } from "../controllers/c_establecimientos.js";
import { protect } from "../middlewares/m_auth.js";

export const establecimientosRouter = Router();

establecimientosRouter.get("/:id", protect, ests_get_one);
