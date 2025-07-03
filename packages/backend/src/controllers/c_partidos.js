import { db_manager } from "../bd/database";

export async function parts_get_all(req, res) {
  try {
    const db = db_manager.getInstance();
    const partidos = await db.get_all("Partido", ["nombre"]);
    if (partidos.length === 0)
      return res
        .status(404)
        .json({ error: "No sé que pudo haber causado esto." });

    partidos.map((partido) => {
      partido.url = `/api/partidos/${partido.nombre.replace(/\s/g, "%20")}`;
    });

    res.status(200).json({
      data: partidos,
    });
  } catch (err) {
    console.log("[ ERROR ] in parts_get_all!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function parts_get_one(req, res) {
  try {
    const { nombre } = req.params;
    if (!nombre) return res.status(400).json({ error: "Nombre inválido." });

    const db = db_manager.getInstance();
    const partido = (await db.get_with("Partido", { nombre: nombre })).pop();
    if (!partido)
      return res.status(404).json({ error: "Partido no encontrado." });

    const candidatos = await db.query(
      `SELECT
        c.ciVotante as ci,
        v.nombreCompleto
        c.candidatura,
        cpart.idEleccion
      FROM Candidato c
      JOIN CandidatoParticipa cpart ON c.ciVotante = cpart.ciCandidato
      JOIN Votante v ON cpart.ciCandidato = v.ci
      WHERE c.nombrePartido = ?`,
      [nombre],
    );

    partido.candidatos = candidatos;
    res.status(200).json({
      data: partido,
    });
  } catch (err) {
    console.log("[ ERROR ] in parts_get_one!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
