import { NextResponse } from "next/server";
import type { ZodError } from "zod";

function formatIssuePath(path: PropertyKey[]) {
  return path.length > 0 ? `${path.join(".")}: ` : "";
}

export function getZodErrorMessages(error: ZodError) {
  return error.issues.map((issue) => `${formatIssuePath(issue.path)}${issue.message}`);
}

export function createValidationErrorResponse(error: ZodError) {
  const errors = getZodErrorMessages(error);

  return NextResponse.json(
    {
      ok: false,
      message: errors[0] ?? "Datos inválidos",
      errors,
    },
    { status: 400 }
  );
}
