import { z } from "zod";

import type { CreateProductInput } from "@/types/product";

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  image: z.string().trim().min(1, "La imagen es obligatoria"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "La descripción corta es obligatoria"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  specifications: z.array(z.string()),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock debe ser mayor o igual a 0"),
}) satisfies z.ZodType<CreateProductInput>;
