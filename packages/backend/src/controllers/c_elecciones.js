import { global_state } from "../index.js";
import { db_manager } from "../bd/database.js";
import { tipo_voto, vote_queue } from "../utils/vote_queue.js";

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

    const circuitos = await db.get_with(
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
      await db.get_with("Establecimiento", {
        id: Number(circuito.idEstablecimiento),
      })
    ).pop();
    if (!establecimiento)
      return res.status(400).json({ error: "No hay establecimiento." });

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
        [circuito.idEstablecimiento],
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

    const circ = (
      await db.get_with(
        "Circuito",
        {
          numero: numero,
          idEleccion: idEleccion,
        },
        ["horaInicio", "estado"],
      )
    ).pop();
    if (!circ) {
      return res.status(404).json({ error: "Circuito no encontrado." });
    }
    if (circ.estado === "cerrado")
      return res.status(404).json({ error: "Circuito ya cerró." });

    // chequeamos la hora
    let hora = global_state.hora_actual;
    hora = Number(hora.replace(/:/g, ""));
    const hora_circ = Number(circ.horaInicio.replace(/:/g, ""));
    if (hora < hora_circ)
      return res.status(409).json({
        error: `El circuito no puede ser abierto antes de las ${circ.horaInicio}`,
      });

    await db.execute(
      "UPDATE Circuito SET estado = ? WHERE numero = ? AND idEleccion = ?",
      ["abierto", numero, idEleccion],
    );

    res.status(200).json({
      data: {
        numero: numero,
        idEleccion: idEleccion,
        estado: "abierto",
        url: `/api/elecciones/${idEleccion}/cirucitos/${numero}`,
      },
    });
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

    const circ = (
      await db.get_with(
        "Circuito",
        {
          numero: numero,
          idEleccion: idEleccion,
        },
        ["horaCierre", "estado"],
      )
    ).pop();
    if (!circ) {
      return res.status(404).json({ error: "Circuito no encontrado." });
    }
    if (circ.estado === "por abrir")
      return res.status(404).json({ error: "Circuito sin abrir." });

    // chequeamos la hora
    let hora = global_state.hora_actual;
    hora = Number(hora.replace(/:/g, ""));
    const hora_circ = Number(circ.horaCierre.replace(/:/g, ""));
    if (hora < hora_circ)
      return res.status(409).json({
        error: `El circuito no puede ser cerrado antes de las ${circ.horaCierre}`,
      });

    await db.execute(
      "UPDATE Circuito SET estado = ? WHERE numero = ? AND idEleccion = ?",
      ["cerrado", numero, idEleccion],
    );

    res.status(200).json({
      data: {
        numero: numero,
        idEleccion: idEleccion,
        estado: "cerrado",
        url: `/api/elecciones/${idEleccion}/cirucitos/${numero}`,
      },
    });
  } catch (err) {
    console.log("[ ERROR ] in circ_close!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function circ_votar(req, res) {
  try {
    const { idEleccion, numero } = req.params;
    const data = req.body;
    const db = db_manager.getInstance();

    const circ = (
      await db.get_with("Circuito", {
        numero: numero,
        idEleccion: idEleccion,
      })
    ).pop();
    if (!circ) {
      return res.status(404).json({ error: "Circuito no encontrado." });
    }

    if (circ.estado !== "abierto")
      return res.status(404).json({ error: "Circuito no habilitado." });

    const votante = {
      ciVotante: data.ciVotante,
      observado: data.observado,
      numCircuito: numero,
      idEleccion: idEleccion,
    };

    const voto = {
      tipo: data.voto.tipo.toLowerCase().trim(),
      nombrePartido: data.voto.nombrePartido,
      numCircuito: numero,
      idEleccion: idEleccion,
    };

    const vq = vote_queue.getInstance();
    const vals = await vq.agregar_voto(voto, votante);
    if (!vals)
      return res.status(500).json({ error: "Unexpected server error." });

    if (vals.error) {
      if (
        vals.error ===
        `El votante con CI ${votante.ciVotante} ya ha votado en esta elección.`
      ) {
        return res.status(409).json({ error: vals.error });
      } else {
        return res.status(404).json({ error: vals.error });
      }
    }

    res.status(201).json({ data: vals });
  } catch (err) {
    console.log("[ ERROR ] in circ_votar!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function el_resultados(req, res) {
  try {
    const { idEleccion } = req.params;
    const db = db_manager.getInstance();

    const circs = await db.get_with("Circuito", {
      idEleccion: idEleccion,
    });
    if (!circs) {
      return res.status(404).json({ error: "Circuitos no encontrados." });
    }

    circs.forEach((circ) => {
      if (circ.estado !== "cerrado") {
        return res.status(404).json({
          error:
            "Resultados no disponibles hasta que se cierren todos los circuitos.",
        });
      }
    });

    // si ya se cerraron todos los circuitos, avisamos a vote_queue que envíe todo
    const vq = vote_queue.getInstance();
    await vq.insertar();

    // escrutinio
    const votos = await db.get_with("Voto", { idEleccion: idEleccion });
    if (votos.length === 0)
      return res.status(500).json({ error: "Unexpected server error." });

    const data = {
      idEleccion: idEleccion,
      votos: {
        total: votos.length,
        validos: 0,
        blanco: 0,
        anulado: 0,
        porFormula: [],
      },
    };

    // contamos los tipos de votos
    votos.reduce((acumulador, voto) => {
      if (voto.tipo === tipo_voto.VALIDO) acumulador.validos++;
      if (voto.tipo === tipo_voto.BLANCO) acumulador.blanco++;
      if (voto.tipo === tipo_voto.ANULADO) acumulador.anulado++;
      return acumulador;
    }, data.votos);

    // contamos por fórmula
    // otro lapso de juicio importante que las tuplas en Valido no tengan info de la elección
    // hay que traer todos y luego filtrar
    const id_validos = new Set(
      votos
        .filter((voto) => voto.tipo === tipo_voto.VALIDO)
        .map((voto) => {
          return voto.id;
        }),
    );

    const validos = (await db.get_all("Valido")).filter((valido) =>
      id_validos.has(valido.idVoto),
    );

    // agregamos a data
    validos.reduce((acumulador, valido) => {
      const formula = acumulador.find(
        (f) => f.partido.nombre === valido.nombrePartido,
      );
      if (formula) {
        formula.votos++;
      } else {
        acumulador.push({
          partido: {
            nombre: valido.nombrePartido,
            url: `/api/partidos/${valido.nombrePartido.replace(/\s/g, "%20")}`,
          },
          votos: 1,
        });
      }
      return acumulador;
    }, data.votos.porFormula);

    res.status(200).json({ data: data });
  } catch (err) {
    console.log("[ ERROR ] in el_resultados!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}

export async function circ_resultados(req, res) {
  try {
    const { idEleccion, numero } = req.params;
    const db = db_manager.getInstance();

    const circ = (
      await db.get_with("Circuito", {
        numero: numero,
        idEleccion: idEleccion,
      })
    ).pop();
    if (!circ) {
      return res.status(404).json({ error: "Circuito no encontrado." });
    }

    if (circ.estado !== "cerrado")
      return res.status(404).json({
        error: "Resultados no disponibles hasta que se cierre el circuito.",
      });

    const votos = await db.get_with("Voto", {
      numeroCircuito: numero,
      idEleccion: idEleccion,
    });
    if (votos.length === 0)
      return res.status(500).json({ error: "Unexpected server error." });

    const data = {
      idEleccion: idEleccion,
      votos: {
        total: votos.length,
        validos: 0,
        blanco: 0,
        anulado: 0,
        porFormula: [],
      },
    };

    // contamos los tipos de votos
    votos.reduce((acumulador, voto) => {
      if (voto.tipo === tipo_voto.VALIDO) acumulador.validos++;
      if (voto.tipo === tipo_voto.BLANCO) acumulador.blanco++;
      if (voto.tipo === tipo_voto.ANULADO) acumulador.anulado++;
      return acumulador;
    }, data.votos);

    // contamos por fórmula
    // otro lapso de juicio importante que las tuplas en Valido no tengan info de la elección
    // hay que traer todos y luego filtrar
    const id_validos = new Set(
      votos
        .filter((voto) => voto.tipo === tipo_voto.VALIDO)
        .map((voto) => {
          return voto.id;
        }),
    );

    const validos = (await db.get_all("Valido")).filter((valido) =>
      id_validos.has(valido.idVoto),
    );

    // agregamos a data
    validos.reduce((acumulador, valido) => {
      const formula = acumulador.find(
        (f) => f.partido.nombre === valido.nombrePartido,
      );
      if (formula) {
        formula.votos++;
      } else {
        acumulador.push({
          partido: {
            nombre: valido.nombrePartido,
            url: `/api/partidos/${valido.nombrePartido.replace(/\s/g, "%20")}`,
          },
          votos: 1,
        });
      }
      return acumulador;
    }, data.votos.porFormula);

    res.status(200).json({ data: data });
  } catch (err) {
    console.log("[ ERROR ] in el_resultados!");
    console.log(err);
    res.status(500).json({ error: "Unexpected server error." });
  }
}
