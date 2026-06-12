import { NextResponse } from "next/server";
import { createProduct, getProducts } from "@/services/product.service";

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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const product = await createProduct(body);

    return NextResponse.json(
      {
        ok: true,
        message: "Producto creado correctamente",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Error al crear producto",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}