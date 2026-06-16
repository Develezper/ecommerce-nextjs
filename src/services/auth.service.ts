import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

import { connectDB } from "@/lib/mongodb";
import {
  isValidEmail,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  normalizeName,
} from "@/lib/auth-validation";
import { User } from "@/models/User";
import { sendWelcomeEmail } from "@/services/mail.service";
import type {
  AuthUserResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
} from "@/types/auth";

function validateRegisterData(data: RegisterInput) {
  const name = normalizeName(data.name);
  const email = normalizeEmail(data.email);
  const password = data.password.trim();

  if (!name || !email || !password) {
    throw new Error("Debes completar todos los campos");
  }

  if (name.length < MIN_NAME_LENGTH) {
    throw new Error("El nombre debe tener al menos 2 caracteres");
  }

  if (!isValidEmail(email)) {
    throw new Error("Ingresa un correo válido");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  return {
    email,
    name,
    password,
  };
}

function validateLoginData(data: LoginInput) {
  const email = normalizeEmail(data.email);
  const password = data.password.trim();

  if (!email || !password) {
    throw new Error("Debes completar correo y contraseña");
  }

  if (!isValidEmail(email)) {
    throw new Error("Ingresa un correo válido");
  }

  return {
    email,
    password,
  };
}

export async function registerUser(
  data: RegisterInput
): Promise<AuthUserResponse> {
  await connectDB();

  const { email, name, password } = validateRegisterData(data);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const authUser: AuthUserResponse = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  try {
    await sendWelcomeEmail({
      to: authUser.email,
      name: authUser.name,
    });
  } catch (error: unknown) {
    console.error("No se pudo enviar el correo de bienvenida", error);
  }

  return authUser;
}

export async function loginUser(data: LoginInput): Promise<LoginResponse> {
  await connectDB();

  const { email, password } = validateLoginData(data);

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET no está definida");
  }

  const secret = new TextEncoder().encode(JWT_SECRET);

  const token = await new SignJWT({
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return {
    token,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  };
}
