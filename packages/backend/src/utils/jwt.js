import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

export class JWTPayload {
  constructor(ci, numCircuito, idEleccion) {
    this.ci = ci;
    this.numCircuito = numCircuito;
    this.idEleccion = idEleccion;
  }
}

const secret = String(process.env.JWT_SECRET);

export function generate_token(pload) {
  return sign(pload, secret);
}

export function verify_token(token) {
  return verify(token, secret);
}
