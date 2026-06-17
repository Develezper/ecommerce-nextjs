import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import type { AuthRole } from "@/types/auth";

type DemoUserSeed = {
  email: string;
  name: string;
  password: string;
  role: AuthRole;
};

export const demoUsers: DemoUserSeed[] = [
  {
    email: "admin@ecommerce.local",
    name: "Admin Demo",
    password: "Admin123!",
    role: "admin",
  },
  {
    email: "cliente1@ecommerce.local",
    name: "Cliente Demo 1",
    password: "User123!",
    role: "user",
  },
  {
    email: "cliente2@ecommerce.local",
    name: "Cliente Demo 2",
    password: "User123!",
    role: "user",
  },
];

export async function upsertDemoUsers(): Promise<DemoUserSeed[]> {
  await connectDB();

  for (const demoUser of demoUsers) {
    const passwordHash = await bcrypt.hash(demoUser.password, 10);

    await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        role: demoUser.role,
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        returnDocument: "after",
      }
    );
  }

  return demoUsers;
}
