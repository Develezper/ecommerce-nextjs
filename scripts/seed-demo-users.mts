import mongoose from "mongoose";

import { upsertDemoUsers } from "../src/services/user.service";

async function main() {
  const users = await upsertDemoUsers();

  console.log("Usuarios de prueba listos:");

  for (const user of users) {
    console.log(
      `- ${user.role.toUpperCase()}: ${user.email} / ${user.password}`
    );
  }
}

main()
  .catch((error: unknown) => {
    console.error("No se pudieron crear los usuarios de prueba", error);
    process.exitCode = 1;
  })
  .finally(() => {
    void mongoose.disconnect();
    console.log("Seed finalizado");
  });
