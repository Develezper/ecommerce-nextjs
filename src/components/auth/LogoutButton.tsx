"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";

type LogoutResponse = {
  message?: string;
};

export default function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("LogoutButton");
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
      {isLoading ? t("loading") : t("idle")}
    </Button>
  );
}
