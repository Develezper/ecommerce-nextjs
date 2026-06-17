import { NextResponse } from "next/server";

import { createValidationErrorResponse } from "@/lib/validation";
import { registerUser } from "@/services/auth.service";
import { registerSchema } from "@/validations/auth.schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsedBody = registerSchema.safeParse(body);

    if (!parsedBody.success) {
      return createValidationErrorResponse(parsedBody.error);
    }

    const user = await registerUser(parsedBody.data);

    return NextResponse.json(
      {
        ok: true,
        message: "Usuario registrado correctamente",
        user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
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
