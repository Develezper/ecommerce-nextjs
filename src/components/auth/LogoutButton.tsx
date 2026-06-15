"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await api.post("/auth/logout");

    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  );
}