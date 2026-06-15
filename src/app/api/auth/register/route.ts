import { NextResponse } from "next/server";

import { registerUser } from "@/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const user = await registerUser(body);

    return NextResponse.json(
      {
        ok: true,
        message: "Usuario registrado correctamente",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Error al registrar usuario",
      },
      { status: 400 }
    );
  }
}