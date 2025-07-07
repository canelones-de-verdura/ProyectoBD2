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
      const conn = await db.getConnection();
      if (this.votos.length === 0 && this.votantes.length === 0) return true;
      await conn.beginTransaction();
      try {
        for (let i = 0; i < this.votos.length; ++i) {
          await conn.execute(
            `INSERT INTO VotanteVota
              (ciVotante, IdEleccion, observado, numCircuito)
            VALUES
              (?, ?, ?, ?)`,
            [
              this.votantes[i].ciVotante,
              this.votantes[i].idEleccion,
              this.votantes[i].observado,
              this.votantes[i].numCircuito,
            ],
          );
          const [data] = await conn.execute(
            `INSERT INTO Voto
              (tipo, horaEmitido, numeroCircuito, idEleccion)
            VALUES
              (?, CURRENT_TIME(), ?, ?)`,
            [
              this.votos[i].tipo,
              this.votos[i].numCircuito,
              this.votos[i].idEleccion,
            ],
          );

          if (this.votos[i].tipo === tipo_voto.VALIDO) {
            await conn.execute(
              `INSERT INTO Valido
                (idVoto, nombrePartido)
              VALUES
                (?, ?)`,
              [data.insertId, this.votos[i].nombrePartido],
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
    if (voto.tipo === tipo_voto.VALIDO && !voto.nombrePartido) return null;
    if (
      voto.tipo !== tipo_voto.VALIDO &&
      voto.tipo !== tipo_voto.BLANCO &&
      voto.tipo !== tipo_voto.ANULADO
    )
      return null;

    if (voto.tipo === tipo_voto.VALIDO) {
      const partido = (
        await db.get_with("Partido", { nombre: voto.nombrePartido })
      ).pop();
      if (!partido) return null;
    }

    // chequeos votante
    if (!votante.ciVotante || votante.observado === undefined) return null;
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
        idEleccion: votante.idEleccion,
      })
    ).pop();
    if (votantevota)
      return {
        error: `El votante con CI ${votante.ciVotante} ya ha votado en esta elección.`,
      };

    // chequeamos en la queue
    if (this.votantes.find((vot) => vot.ciVotante === votante.ciVotante))
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
        circuito.serie !== persona_serie ||
        persona_num < circ_rango_inicio ||
        persona_num > circ_rango_fin
      ) {
        console.log(circuito.serie);
        votante.observado = true;
      }
    }

    // mandamos a la queue
    if (votante.observado) {
      this.votos_observados.push(voto);
      this.votantes_observados.push(votante);
      console.log("?");
    } else {
      if (this.votos.length >= this.batchsize) {
        // mandamos para la queue
        this.mezclar(this.votos);
        let res = false;
        while (!res) res = await this.insertar(); // si no funca que siga intentando
        this.votos = [];
        this.votantes = [];
      }

      this.votos.push(voto);
      this.votantes.push(votante);
    }

    return {
      ciVotante: votante.ciVotante,
      idEleccion: votante.idEleccion,
      observado: votante.observado,
      numCircuito: votante.numCircuito,
    };
  }
}
