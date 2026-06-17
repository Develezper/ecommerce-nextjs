import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-user";
import { createValidationErrorResponse } from "@/lib/validation";
import {
  getFavoriteProducts,
  toggleFavorite,
} from "@/services/favorite.service";
import { favoriteSchema } from "@/validations/favorite.schema";

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

    const body: unknown = await request.json();
    const parsedBody = favoriteSchema.safeParse(body);

    if (!parsedBody.success) {
      return createValidationErrorResponse(parsedBody.error);
    }

    const favorite = await toggleFavorite(user.userId, parsedBody.data.productId);

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
