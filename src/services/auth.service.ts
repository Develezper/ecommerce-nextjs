import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import type { AuthUserResponse, RegisterInput } from "@/types/auth";

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

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}