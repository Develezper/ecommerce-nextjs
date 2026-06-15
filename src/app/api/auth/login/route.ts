import { NextResponse } from "next/server";

import { loginUser } from "@/services/auth.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { token, user } = await loginUser(body);

    const response = NextResponse.json({
      ok: true,
      message: "Login correcto",
      user,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Error al iniciar sesión",
      },
      { status: 401 }
    );
  }
}