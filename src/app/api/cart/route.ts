import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { addProductToCart, getUserCart } from "@/services/cart.service";

export const runtime = "nodejs";

type AddCartProductBody = {
  productId?: unknown;
};

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

    const body = (await request.json()) as AddCartProductBody;

    if (typeof body.productId !== "string" || body.productId.trim() === "") {
      return NextResponse.json(
        {
          ok: false,
          message: "El productId es obligatorio",
        },
        { status: 400 }
      );
    }

    const cart = await addProductToCart(user.userId, body.productId);

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
