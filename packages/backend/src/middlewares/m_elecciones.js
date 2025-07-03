import { global_state } from "../index.js";

// TODO pensar bien el tema de la elección
export async function protect_eleccion(req, res, next) {
  // const pload = req.decoded;
  //
  // if (!pload) {// por las dudas
  //   res.status(401).json({ message: 'No autorizado, no hay token' });
  //   return
  // }
  //
  // if (pload?.idEleccion !== global_state.eleccion_actual.id) {
  //   res.status(401).json({ message: 'No autorizado, token fallido' });
  //   return
  // }

  next();
}
