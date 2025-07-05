import express from "express";
import cors from "cors";
import { db_manager } from "./bd/database.js";
import { authRouter } from "./routes/r_auth.js";
// import { candidatosRouter } from "./routes/r_candidatos.js";
import { departamentosRouter } from "./routes/r_departamentos.js";
import { eleccionesRouter } from "./routes/r_elecciones.js";
import { establecimientosRouter } from "./routes/r_establecimientos.js";
import { partidosRouter } from "./routes/r_partidos.js";
import { votantesRouter } from "./routes/r_votantes.js";

const db = db_manager.getInstance();
export const global_state = {
  // guardamos la elección actual
  eleccion_actual: (
    await db.execute("SELECT * FROM Eleccion ORDER BY id DESC LIMIT 1")
  )?.pop(),

  // guardamos la hora
  hora_actual: process.env.HORA,
};

if (!global_state.eleccion_actual || !global_state.hora_actual) {
  console.log("Falta información en .env");
  process.exit(1);
}

// TODO si las elecciones ya terminaron, habilitar solo los endpoints de
// resultados

const app = express();
const port = 3000;

app.use(cors()); // espero evitar los quilombos que tuvimos en BD1
app.use(express.json());

app.use("/api/auth", authRouter);
// app.use("/api/candidatos", candidatosRouter);
app.use("/api/departamentos", departamentosRouter);
app.use("/api/elecciones", eleccionesRouter);
app.use("/api/establecimientos", establecimientosRouter);
app.use("/api/partidos", partidosRouter);
app.use("/api/votantes", votantesRouter);

app.listen(port, () => {
  console.log(`Cuchando en ${port}`);
});
