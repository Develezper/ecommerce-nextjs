import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { createValidationErrorResponse } from "@/lib/validation";
import { addProductToCart, getUserCart } from "@/services/cart.service";
import { addCartProductSchema } from "@/validations/cart.schema";

export const runtime = "nodejs";

function getErrorStatus(message: string) {
  if (message.includes("inválido") || message.includes("obligatorio")) {
    return 400;
  }

  if (message.includes("no encontrado")) {
    return 404;
  }

  return 500;
}

export async function GET() {
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

    const cart = await getUserCart(user.userId);

    return NextResponse.json({
      ok: true,
      products: cart.products,
      total: cart.total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al obtener carrito";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: getErrorStatus(message) }
    );
  }
}

export async function POST(request: Request) {
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

    const body: unknown = await request.json();
    const parsedBody = addCartProductSchema.safeParse(body);

    if (!parsedBody.success) {
      return createValidationErrorResponse(parsedBody.error);
    }

    const cart = await addProductToCart(user.userId, parsedBody.data.productId);

    return NextResponse.json({
      ok: true,
      products: cart.products,
      total: cart.total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al agregar producto";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: getErrorStatus(message) }
    );
  }
}
