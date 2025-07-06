import { global_state } from "../index.js";
import { db_manager } from "../bd/database.js";

export const tipo_voto = Object.freeze({
  VALIDO: "valido",
  BLANCO: "blanco",
  ANULADO: "anulado",
});

export class vote_queue {
  static instance;

  constructor() {
    this.votos = [];
    this.votantes = [];
    this.batchsize = 10;

    this.votos_observados = [];
    this.votantes_observados = [];
  }

  static getInstance() {
    if (!this.instance) this.instance = new vote_queue();
    return this.instance;
  }

  mezclar(lista) {
    let i_actual = lista.length;
    let i_random;

    while (i_actual !== 0) {
      i_random = Math.floor(Math.random() * i_actual);
      i_actual--;

      [lista[i_actual], lista[i_random]] = [lista[i_random], lista[i_actual]];
    }
  }

  async insertar() {
    try {
      const db = db_manager.getInstance();
      const conn = db.getConnection();
      await conn.beginTransaccion();
      try {
        // TODO QUERIES
        for (i = 0; i < this.batchsize; ++i) {
          await conn.execute(
            `INSERT INTO VotanteVota
              (ciVotante, IdEleccion, observado, numCircuito)
            VALUES
              (?, ?, ?, ?)`,
            [
              votantes[i].ciVotante,
              votantes[i].idEleccion,
              votantes[i].observado,
              votantes[i].numCircuito,
            ],
          );
          const [data] = await conn.execute(
            `INSERT INTO Voto
              (tipo, horaEmitido, numeroCircuito, idEleccion)
            VALUES
              (?, CURRENT_TIME(), ?, ?)`,
            [voto[i].tipo, voto[i].numCircuito, voto[i].idEleccion],
          );

          if (voto[i].tipo === tipo_voto.VALIDO) {
            await conn.execute(
              `INSERT INTO Valido
                (idVoto, nombrePartido)
              VALUES
                (?, ?)`,
              [data.insertId, voto[i].nombrePartido],
            );
          }
        }
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      }

      conn.release();
      return true;
    } catch (err) {
      console.log("[ ERROR ] insertando votos!");
      console.log(err);
      return false;
    }
  }

  async agregar_voto(voto, votante) {
    const db = db_manager.getInstance();

    // chequeos voto
    if (!voto.tipo) return null;
    if (voto.tipo === tipo.VALIDO && !voto.nombrePartido) return null;
    if (
      voto.tipo !== tipo.VALIDO &&
      voto.tipo !== tipo.BLANCO &&
      voto.tipo !== tipo.ANULADO
    )
      return null;

    const partido = (
      await db_manager.get_with("Partido", { nombre: voto.nombrePartido })
    ).pop();
    if (!partido) return null;

    // chequeos votante
    if (!votante.ciVotante || !votante.observado) return null;
    const persona = (
      await db.get_with("Votante", { ci: votante.ciVotante })
    ).pop();
    if (!persona)
      return {
        error: `El votante con CI ${votante.ciVotante} no fue encontrado.`,
      };

    // chequeamos si ya votó
    const votantevota = (
      await db.get_with("VotanteVota", {
        ciVotante: votante.ciVotante,
        idEleccion: votante.IdEleccion,
      })
    ).pop();
    if (votantevota)
      return {
        error: `El votante con CI ${votante.ciVotante} ya ha votado en esta elección.`,
      };

    // observamos si el votante es de otro circuito
    const circuito = (
      await db.get_with("Circuito", {
        numero: votante.numCircuito,
        idEleccion: votante.idEleccion,
      })
    ).pop();
    if (!circuito) return null;

    const persona_serie = persona.credencial.split(" ")[0];
    const persona_num = Number(persona.credencial.split(" ")[1]);
    // un lapso de juicio importante haber definido los rangos como VARCHAR
    const circ_rango_inicio = Number(circuito.rangoInicioCred);
    const circ_rango_fin = Number(circuito.rangoFinCred);
    if (!votante.observado) {
      if (
        !circuito.serie !== persona.persona_serie ||
        persona_num < circ_rango_inicio ||
        persona_num > circ_rango_fin
      )
        votante.observado = true;
    }

    // mandamos a la queue
    if (votante.observado) {
      this.votos_observados.push(voto);
      this.votantes_observados.push(votante);
    } else {
      if (this.votos.length >= this.batchsize) {
        // mandamos para la queue
        this.mezclar(this.votos);
        let res = false;
        while (!res) res = await this.insertar(); // si no funca que siga intentando
        this.votos = [];
        this.votantes = [];
      }

      votos.push(voto);
      votantes.push(votante);

      return {
        ciVotante: votante.ciVotante,
        idEleccion: votante.idEleccion,
        observado: votante.observado,
        numCircuito: votante.numCircuito,
      };
    }
  }
}
