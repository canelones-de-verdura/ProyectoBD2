import { db_manager } from "../bd/database.js";
import { global_state } from "../index.js";
import { generate_token, JWTPayload } from "../utils/jwt.js";

export async function auth_controller(req, res) {
  try {
    const { ci, credencial } = req.body;

    if (!ci || !credencial) {
      res.status(400).json({
        error: "Invalid request data.",
      });
      return;
    }

    const db = db_manager.getInstance();

    // recuperamos la mesa
    const mesa = (
      await db.get_with("Mesa", {
        ciPresidente: ci,
        idEleccion: global_state.eleccion_actual.id,
      })
    ).pop();

    // const mesa = (await db.execute(
    //   "SELECT * FROM Mesa WHERE ciPresidente = ? AND idEleccion = ?",
    //   [ci, global_state.eleccion_actual.id]
    // )).pop()

    // recuperamos la credencial para autenticar
    const datos = (
      await db.get_with("Votante", {
        ci: ci,
      })
    ).pop();

    // const datos = (await db.execute(
    //   "SELECT * from Votante WHERE ci = ?",
    //   [ci]
    // )).pop()

    if (!mesa || !datos || datos.credencial != credencial) {
      res.status(401).json({
        error: "Credenciales inválidas o no es presidente de mesa activo.",
      });
      return;
    }

    const pload = {
      ci: ci,
      numCircuito: mesa.numeroCircuito,
      idEleccion: mesa.idEleccion,
    };
    const token = generate_token(pload);

    res.status(200).json({
      data: {
        token: token,
        circuito: {
          numero: mesa.numeroCircuito,
          idEleccion: mesa.idEleccion,
          url: `/api/elecciones/${mesa.idEleccion}/circuitos/${mesa.numeroCircuito}`,
        },
      },
    });
  } catch (err) {
    console.log("[ ERROR ] in auth_controller!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
