import { NextResponse } from "next/server";

import { createValidationErrorResponse } from "@/lib/validation";
import { loginUser } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsedBody = loginSchema.safeParse(body);

    if (!parsedBody.success) {
      return createValidationErrorResponse(parsedBody.error);
    }

    const { token, user } = await loginUser(parsedBody.data);

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
  } catch (error: unknown) {
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
