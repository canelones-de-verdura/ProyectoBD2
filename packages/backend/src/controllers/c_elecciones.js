import { global_state } from "..";
import { db_manager } from "../bd/database";

export async function el_get_all(req, res) {
  try {
    const db = db_manager.getInstance();

    const elecciones = await db.get_all("Eleccion");
    if (elecciones.length === 0)
      return res.status(404).json({ error: "No hay elecciones (???)" });

    res.status(200).json({
      data: elecciones,
    });
  } catch (err) {
    console.log("[ ERROR ] in el_get_all!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function el_get_one(req, res) {
  try {
    const { idEleccion } = req.params;
    const db = db_manager.getInstance();

    const eleccion = (await db.get_with("Eleccion", { id: idEleccion })).pop();
    if (!eleccion)
      return res.status(404).json({ error: "Elección no encontrada." });

    res.status(200).json({
      data: eleccion,
    });
  } catch (err) {
    console.log("[ ERROR ] in el_get_one!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function circ_get_all(req, res) {
  try {
    const { idEleccion } = req.params;
    const db = db_manager.getInstance();

    const circuitos = await db.getInstance(
      "Circuito",
      { idEleccion: idEleccion },
      ["numero", "estado"],
    );
    if (circuitos.length === 0)
      return res.status(404).json({ error: "No hay circuitos (???)" });

    circuitos.map((c) => {
      c.url = `/api/elecciones/${idEleccion}/circuitos/${c.numero}`;
    });

    res.status(200).json({
      data: circuitos,
    });
  } catch (err) {
    console.log("[ ERROR ] in circ_get_all!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function circ_get_one(req, res) {
  try {
    const { idEleccion, numero } = req.params;
    const db = db_manager.getInstance();

    const circuito = (
      await db.get_with("Circuito", { numero: numero, idEleccion: idEleccion })
    ).pop();
    if (!circuito)
      return res.status(404).json({ error: "Circuito no encontrado." });

    // Lógica sacada de ests_get_one.
    // estaría bueno mover esto a otra función dsp
    const establecimiento = (
      await db.get_with("Establecimiento", { id: Number(id) })
    ).pop();
    if (!establecimiento)
      return res.status(400).json({ error: "No hay establecimiento." });

    const departamento = (
      await db.get_with("Departamento", {
        numero: establecimiento.numeroDepartamento,
      })
    ).pop();
    if (!dep)
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

    const todo_junto = {
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

    delete circuito.idEstablecimiento;
    circuito.establecimiento = todo_junto;
    res.status(200).json({
      data: circuito,
    });
  } catch (err) {
    console.log("[ ERROR ] in circ_get_all!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function circ_open(req, res) {
  try {
    const db = db_manager.getInstance();
    const { idEleccion, numero } = req.params;

    const circ = (await db.get_with(
      "Circuito",
      {
        numero: numero,
        idEleccion: idEleccion,
      },
      ["horaInicio"],
    )).pop();
    if (!circ) {
      return res.status(404).json({ error: "Circuito no encontrado." })
    }

    // chequeamos la hora
    let hora = global_state.hora_actual;
    hora = Number(hora.replace(/:/g, ""))
    const hora_circ = Number(circ.horaInicio.replace(/:/g, ""))
    if (hora < hora_circ)
      return res.status(409).json({
        error: `El circuito no puede ser abierto antes de las ${circ.horaInicio}`,
      });

    await db.execute(
      "UPDATE Circuito SET estado = ? WHERE numero = ? AND idEleccion = ?",
      ["abierto", numero, idEleccion]
    )

    res.status(200).json({
      data: {
        numero: numero,
        idEleccion: idEleccion,
        estado: "abierto",
        url: `/api/elecciones/${idEleccion}/cirucitos/${numero}`
      }
    })
  } catch (err) {
    console.log("[ ERROR ] in circ_open!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function circ_close(req, res) {
  try {
    const db = db_manager.getInstance();
    const { idEleccion, numero } = req.params;

    const circ = (await db.get_with(
      "Circuito",
      {
        numero: numero,
        idEleccion: idEleccion,
      },
      ["horaCierre"],
    )).pop();
    if (!circ) {
      return res.status(404).json({ error: "Circuito no encontrado." })
    }

    // chequeamos la hora
    let hora = global_state.hora_actual;
    hora = Number(hora.replace(/:/g, ""))
    const hora_circ = Number(circ.horaCierre.replace(/:/g, ""))
    if (hora < hora_circ)
      return res.status(409).json({
        error: `El circuito no puede ser cerrado antes de las ${circ.horaCierre}`,
      });

    await db.execute(
      "UPDATE Circuito SET estado = ? WHERE numero = ? AND idEleccion = ?",
      ["cerrado", numero, idEleccion]
    )

    res.status(200).json({
      data: {
        numero: numero,
        idEleccion: idEleccion,
        estado: "cerrado",
        url: `/api/elecciones/${idEleccion}/cirucitos/${numero}`
      }
    })
  } catch (err) {
    console.log("[ ERROR ] in circ_close!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
