import { z } from "zod";

import type { CreateProductInput } from "@/types/product";

function numberFromString(fieldName: string, options?: { integer?: boolean }) {
  return z
    .string()
    .trim()
    .min(1, `${fieldName} es obligatorio`)
    .transform((value, context) => {
      const parsedValue = Number(value);

      if (!Number.isFinite(parsedValue)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${fieldName} debe ser un número válido`,
        });

        return z.NEVER;
      }

      return parsedValue;
    })
    .pipe(
      z
        .number()
        .min(0, `${fieldName} debe ser mayor o igual a 0`)
        .refine(
          (value) => !options?.integer || Number.isInteger(value),
          `${fieldName} debe ser un número entero`
        )
    );
}

function parseSpecifications(value: string) {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

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

export const createProductFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  price: numberFromString("El precio"),
  shortDescription: z
    .string()
    .trim()
    .min(1, "La descripción corta es obligatoria"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  specifications: z.string().transform(parseSpecifications),
  stock: numberFromString("El stock", { integer: true }),
  image: z
    .instanceof(File, { message: "La imagen es obligatoria" })
    .refine((file) => file.size > 0, "La imagen es obligatoria"),
});
