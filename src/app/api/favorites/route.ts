import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import {
  getFavoriteProducts,
  toggleFavorite,
} from "@/services/favorite.service";

export const runtime = "nodejs";

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

    const products = await getFavoriteProducts(user.userId);

    return NextResponse.json({
      ok: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al obtener favoritos",
      },
      { status: 500 }
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

    const body = (await request.json()) as {
      productId?: string;
    };

    if (!body.productId) {
      return NextResponse.json(
        {
          ok: false,
          message: "El productId es obligatorio",
        },
        { status: 400 }
      );
    }

    const favorite = await toggleFavorite(user.userId, body.productId);

    return NextResponse.json({
      ok: true,
      favorite,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar favorito",
      },
      { status: 500 }
    );
  }
}