import { global_state } from "../index.js";

export async function protect_eleccion(req, res, next) {
  const { idEleccion } = req.params;
  const pload = req.decoded;

  if (!pload) {
    // por las dudas
    res.status(401).json({ message: "No autorizado, no hay token" });
    return;
  }

  if (
    pload?.idEleccion !== global_state.eleccion_actual.id ||
    pload?.idEleccion !== Number(idEleccion)
  ) {
    res.status(401).json({ message: "No autorizado, token fallido" });
    return;
  }

  next();
}
