import { Router } from "express";
import { protect } from "../middlewares/m_auth";
import { parts_get_all, parts_get_one } from "../controllers/c_partidos";

export const partidosRouter = Router();

partidosRouter.get("/:nombre", protect, parts_get_one);

partidosRouter.get("/", protect, parts_get_all);
