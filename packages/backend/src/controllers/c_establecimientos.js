import { db_manager } from "../bd/database.js";

export async function ests_get_one(req, res) {
  try {
    let { id } = req.params;
    id = Number(id);
    if (!id || !Number.isInteger(id))
      return res.status(400).json({ error: "ID inválida." });

    const db = db_manager.getInstance();
    const establecimiento = (
      await db.get_with("Establecimiento", { id: Number(id) })
    ).pop();
    if (!establecimiento)
      return res.status(400).json({ error: "ID no encontrada." });

    const departamento = (
      await db.get_with("Departamento", {
        numero: establecimiento.numeroDepartamento,
      })
    ).pop();
    if (!departamento)
      return res
        .status(404)
        .json({ error: "No sé que pudo haber causado esto." });

    const direccion = (
      await db.execute(
        `SELECT
          e.id as idEstablecimiento,
          d.calle,
          d.numero,
          d.ciudad,
          d.pueblo,
          d.paraje
        FROM Establecimiento e
        JOIN DireccionEstablecimiento de ON e.id = de.idEstablecimiento
        JOIN Direccion d ON de.idDireccion = d.id
        WHERE e.id = ?`,
        [id],
      )
    ).pop();
    if (!direccion) {
      return res.status(404).json({ error: "No hay dirección." });
    }

    const data = {
      id: establecimiento.id,
      nombre: establecimiento.nombre,
      departamento: departamento,
      direccion: {
        calle: direccion.calle,
        numero: direccion.numero,
        ciudad: direccion.ciudad,
        pueblo: direccion.pueblo,
        paraje: direccion.paraje,
      },
    };

    res.status(200).json({
      data: data,
    });
  } catch (err) {
    console.log("[ ERROR ] in ests_get_one!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
