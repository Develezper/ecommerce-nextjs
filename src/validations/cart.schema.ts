import { z } from "zod";

export const addCartProductSchema = z.object({
  productId: z.string().trim().min(1, "El productId es obligatorio"),
});

export const updateCartQuantitySchema = z.object({
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .gt(0, "La cantidad debe ser mayor a 0"),
});

export type AddCartProductInput = z.infer<typeof addCartProductSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;
