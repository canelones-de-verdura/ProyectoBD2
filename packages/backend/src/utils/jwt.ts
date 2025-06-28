import { JwtPayload, sign, verify } from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;
export function generate_token(pload: string) {
  return sign(pload, secret);
}

export function verify_token(token: string) {
  return verify(token, secret);
}
