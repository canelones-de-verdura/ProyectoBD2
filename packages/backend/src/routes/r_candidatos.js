import { Router } from "express"
import { protect } from "../middlewares/m_auth.js"
import { cand_get_all, cand_get_one } from "../controllers/c_candidatos.js"

export const candidatosRouter = Router()

candidatosRouter.get("/", protect, cand_get_all)
candidatosRouter.get("/:id", protect, cand_get_one)
