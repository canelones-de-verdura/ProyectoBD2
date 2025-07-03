import { Router } from "express";
import { protect } from "../middlewares/m_auth";
import { vot_get_one } from "../controllers/c_votantes";

export const votantesRouter = Router();

votantesRouter.get("/:ci", protect, vot_get_one);

votantesRouter.get("/", protect, vot_get_all);
