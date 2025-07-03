import { verify_token } from "../utils/jwt.js";

export async function protect(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = verify_token(token);

      if (!decoded.ci || !decoded.numCircuito || !decoded.idEleccion)
        return res
          .status(401)
          .json({ message: "No autorizado, token fallido" });

      req.decoded = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "No autorizado, token fallido" });
    }
  }

  if (!token) res.status(401).json({ message: "No autorizado, no hay token" });
}
