import { db_manager } from "../bd/database.js";

export async function deps_get_one(req, res) {
  try {
    const { numero } = req.params;
    if (!numero || !Number.isInteger(numero) || numero < 0 || numero > 19)
      return res.status(400).json({ error: "Del 1 al 19" });

    const db = db_manager.getInstance();
    const dep = (await db.get_with("Departamento", { numero })).pop();
    if (!dep) {
      return res
        .status(404)
        .json({ error: "No sé que pudo haber causado esto." });
    }

    res.status(200).json({
      data: dep,
    });
  } catch (err) {
    console.log("[ ERROR ] in deps_get_one!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function deps_get_all(req, res) {
  try {
    const db = db_manager.getInstance();
    const deps = await db.get_all("Departamento");
    if (deps.length === 0) {
      return res
        .status(404)
        .json({ error: "No sé que pudo haber causado esto." });
    }

    res.status(200).json({
      data: deps,
    });
  } catch (err) {
    console.log("[ ERROR ] in deps_get_all!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function deps_get_establecimientos(req, res) {
  try {
    const { numero } = req.params;
    if (!numero || !Number.isInteger(numero) || numero < 0 || numero > 19)
      return res.status(400).json({ error: "Del 1 al 19" });

    const db = db_manager.getInstance();
    const establecimientos = await db.get_with(
      "Establecimiento",
      { numeroDepartamento: numero },
      ["id", "nombre", "tipo"],
    );
    if (establecimientos.length === 0) {
      return res
        .status(404)
        .json({ error: "No hay establecimientos en este departamento." });
    }

    const direcciones = await db.query(
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
      WHERE e.numeroDepartamento = ?`,
      [numero],
    );
    if (direcciones.length === 0) {
      return res.status(404).json({ error: "No hay direcciones." });
    }

    establecimientos.map((est) => {
      const dir = direcciones.find((elem) => {
        elem.idEstablecimiento = est.id;
      });

      est.direccion = {
        calle: dir.calle,
        numero: dir.numero,
        ciudad: dir.ciudad,
        pueblo: dir.pueblo,
        paraje: dir.paraje,
      };

      est.url = `/api/establecimientos/${est.id}`;
    });

    res.status(200).json({
      data: establecimientos,
    });
  } catch (err) {
    console.log("[ ERROR ] in deps_get_establecimientos!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
