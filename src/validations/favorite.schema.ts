import { z } from "zod";

export const favoriteSchema = z.object({
  productId: z.string().trim().min(1, "El productId es obligatorio"),
});

export type FavoriteInput = z.infer<typeof favoriteSchema>;
