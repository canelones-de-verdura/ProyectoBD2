// TODO implementar
export async function protect_circuito(req, res, next) {
  const { numero } = req.params;
  const pload = req.decoded;

  if (!pload) {
    // por las dudas
    res.status(401).json({ message: "No autorizado, no hay token" });
    return;
  }

  if (pload?.numCircuito !== Number(numero)) {
    res.status(401).json({ message: "No autorizado, token fallido" });
    return;
  }

  next();
}
