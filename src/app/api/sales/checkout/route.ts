import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { checkoutUserSale } from "@/services/sale.service";

export const runtime = "nodejs";

function getErrorStatus(message: string) {
  if (message.includes("inválido") || message.includes("vacío")) {
    return 400;
  }

  return 500;
}

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "Debes iniciar sesión",
        },
        { status: 401 }
      );
    }

    const sale = await checkoutUserSale(user.userId);

    return NextResponse.json({
      ok: true,
      message: "Compra exitosa",
      sale,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al procesar la compra";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: getErrorStatus(message) }
    );
  }
}
