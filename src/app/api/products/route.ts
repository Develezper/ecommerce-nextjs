import { NextResponse } from "next/server";
import { createValidationErrorResponse } from "@/lib/validation";
import { createProduct, getProducts } from "@/services/product.service";
import { createProductSchema } from "@/validations/product.schema";

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
    const body: unknown = await request.json();
    const parsedBody = createProductSchema.safeParse(body);

    if (!parsedBody.success) {
      return createValidationErrorResponse(parsedBody.error);
    }

    const product = await createProduct(parsedBody.data);

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
