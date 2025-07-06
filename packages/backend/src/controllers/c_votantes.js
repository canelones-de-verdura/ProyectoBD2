import { db_manager } from "../bd/database.js";

export async function vot_get_one(req, res) {
  try {
    const { ci } = req.params;

    const db = db_manager.getInstance();
    const votante = (await db.get_with("Votante", { ci: ci })).pop();
    if (!votante)
      return res.status(404).json({ error: "Votante no encontrado." });

    const vota = await db.get_with("VotanteVota", { ciVotante: ci }, [
      "idEleccion",
      "numCircuito",
      "observado",
    ]);
    votante.votaEn = vota;

    res.status(200).json({
      data: votante,
    });
  } catch (err) {
    console.log("[ ERROR ] in vot_get_one!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
export async function vot_get_all(req, res) {
  try {
    const db = db_manager.getInstance();

    const votantes = await db.get_all("Votante", [
      "ci",
      "nombreCompleto",
      "credencial",
    ]);
    if (votantes.length === 0)
      return res.status(404).json({ error: "No hay votantes (???)" });

    votantes.map((votante) => {
      votante.url = `/api/votantes/${votante.ci}`;
    });

    res.status(200).json({
      data: votantes,
    });
  } catch (err) {
    console.log("[ ERROR ] in vot_get_all!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
