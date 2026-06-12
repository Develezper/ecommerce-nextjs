import { NextResponse } from "next/server";
import { getProducts } from "@/services/product.service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({
      ok: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener productos",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}