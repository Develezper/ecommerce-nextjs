import { NextResponse } from "next/server";
import { uploadProductImage } from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/current-user";
import { createValidationErrorResponse } from "@/lib/validation";
import { createProduct, getProducts } from "@/services/product.service";
import { createProductFormSchema } from "@/validations/product.schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({
      ok: true,
      products,
    });
  } catch (error: unknown) {
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
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          message: "No autenticado",
        },
        { status: 401 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          ok: false,
          message: "No autorizado para crear productos",
        },
        { status: 403 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          ok: false,
          message: "Debes enviar el producto como FormData con una imagen",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const parsedFormData = createProductFormSchema.safeParse({
      name: formData.get("name"),
      price: formData.get("price"),
      shortDescription: formData.get("shortDescription"),
      description: formData.get("description"),
      specifications: formData.get("specifications"),
      stock: formData.get("stock"),
      image: formData.get("image"),
    });

    if (!parsedFormData.success) {
      return createValidationErrorResponse(parsedFormData.error);
    }

    const {
      image,
      name,
      price,
      shortDescription,
      description,
      specifications,
      stock,
    } = parsedFormData.data;
    const imageArrayBuffer = await image.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    const imageUrl = await uploadProductImage(imageBuffer);

    const product = await createProduct({
      name,
      price,
      image: imageUrl,
      shortDescription,
      description,
      specifications,
      stock,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Producto creado correctamente",
        product,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
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
