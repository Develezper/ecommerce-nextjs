import { z } from "zod";

import type { LoginInput, RegisterInput } from "@/types/auth";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Ingresa un correo válido"),
  password: z
    .string()
    .trim()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
}) satisfies z.ZodType<RegisterInput>;

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().trim().min(1, "La contraseña es obligatoria"),
}) satisfies z.ZodType<LoginInput>;
