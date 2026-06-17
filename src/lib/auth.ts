import { jwtVerify } from "jose";

import type { AuthRole } from "@/types/auth";

export type AuthPayload = {
  userId: string;
  name: string;
  email: string;
  role: AuthRole;
};

export function normalizeUserRole(role: unknown): AuthRole {
  return role === "admin" ? "admin" : "user";
}

function getJwtSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definida");
  }

  return new TextEncoder().encode(JWT_SECRET);
}

export async function verifyAuthToken(
  token: string
): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: normalizeUserRole(payload.role),
    };
  } catch {
    return null;
  }
}
