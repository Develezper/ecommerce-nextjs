"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type LogoutResponse = {
  message?: string;
};

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      await api.post<LogoutResponse>("/auth/logout");

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Cerrando..." : "Cerrar sesión"}
    </Button>
  );
}
