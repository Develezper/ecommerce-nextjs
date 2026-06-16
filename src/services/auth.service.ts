import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { sendWelcomeEmail } from "@/services/mail.service";
import type {
  AuthUserResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
} from "@/types/auth";

export async function registerUser(
  data: RegisterInput
): Promise<AuthUserResponse> {
  await connectDB();

  const email = data.email.toLowerCase().trim();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    name: data.name.trim(),
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

  const email = data.email.toLowerCase().trim();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

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
