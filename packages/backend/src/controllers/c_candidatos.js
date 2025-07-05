import { db_manager } from "../bd/database.js"

const db = db_manager.getInstance()

export async function cand_get_all(req, res) {
  try {
    const candidatos = await db.execute("SELECT * FROM Candidato")
    res.json(candidatos)
  } catch (error) {
    console.error("Error al obtener candidatos:", error)
    res.status(500).json({ error: "Error al obtener candidatos" })
  }
}

export async function cand_get_one(req, res) {
  const id = req.params.id

  try {
    const [candidato] = await db.execute(
      "SELECT * FROM Candidato WHERE id = ?",
      [id]
    )

    if (!candidato) {
      return res.status(404).json({ error: "Candidato no encontrado" })
    }

    res.json(candidato)
  } catch (error) {
    console.error("Error al obtener candidato:", error)
    res.status(500).json({ error: "Error al obtener candidato" })
  }
}
