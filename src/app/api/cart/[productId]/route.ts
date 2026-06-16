import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import {
  removeProductFromCart,
  updateCartProductQuantity,
} from "@/services/cart.service";

export const runtime = "nodejs";

type UpdateCartQuantityBody = {
  quantity?: unknown;
};

function getErrorStatus(message: string) {
  if (
    message.includes("inválido") ||
    message.includes("obligatorio") ||
    message.includes("mayor a 0")
  ) {
    return 400;
  }

  if (message.includes("no encontrado")) {
    return 404;
  }

  return 500;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
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

    const body = (await request.json()) as UpdateCartQuantityBody;
    const quantity =
      typeof body.quantity === "number" ? body.quantity : Number.NaN;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "La cantidad debe ser mayor a 0",
        },
        { status: 400 }
      );
    }

    const { productId } = await params;
    const cart = await updateCartProductQuantity(
      user.userId,
      productId,
      quantity
    );

    return NextResponse.json({
      ok: true,
      products: cart.products,
      total: cart.total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar carrito";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: getErrorStatus(message) }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
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

    const { productId } = await params;
    const cart = await removeProductFromCart(user.userId, productId);

    return NextResponse.json({
      ok: true,
      products: cart.products,
      total: cart.total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al eliminar producto";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: getErrorStatus(message) }
    );
  }
}
