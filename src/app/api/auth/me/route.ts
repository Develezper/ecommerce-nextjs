import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyAuthToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        message: "No autenticado",
      },
      { status: 401 }
    );
  }

  const user = await verifyAuthToken(token);

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Token inválido o expirado",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    user: {
      _id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
