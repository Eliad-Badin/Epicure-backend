import jwt, { Secret } from "jsonwebtoken";
import type { UserInterface } from "../../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3d";

export type JwtPayload = {
  userId: string;
  role: "ADMIN" | "USER";
};

export function signAuthToken(user: UserInterface): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET as Secret, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
}

export function verifyAuthToken(token: string): JwtPayload | null {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  try {
    return jwt.verify(token, JWT_SECRET as Secret) as JwtPayload;
  } catch {
    return null;
  }
}
