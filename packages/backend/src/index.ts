import express from "express";
import cors from "cors";
import { db_manager } from "./bd/database.js";
import { authRouter } from "./routes/r_auth.js";
import { candidatosRouter } from "./routes/r_candidatos.js";
import { departamentosRouter } from "./routes/r_departamentos.js";
import { eleccionesRouter } from "./routes/r_elecciones.js";
import { establecimientosRouter } from "./routes/r_establecimientos.js";
import { partidosRouter } from "./routes/r_partidos.js";
import { votantesRouter } from "./routes/r_votantes.js";

const app = express();
const port = 3000;

app.use(cors()); // espero evitar los quilombos que tuvimos en BD1
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/candidatos", candidatosRouter);
app.use("/api/departamentos", departamentosRouter);
app.use("/api/elecciones", eleccionesRouter);
app.use("/api/establecimientos", establecimientosRouter);
app.use("/api/partidos", partidosRouter);
app.use("/api/votantes", votantesRouter);

app.listen(port, () => {
  console.log(`Cuchando en ${port}`);
});

db_manager.getInstance(); // así ya queda la conexión pronta desde el inicio
