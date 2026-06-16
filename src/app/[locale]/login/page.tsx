"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function translateLoginMessage(messageText: string | undefined) {
    switch (messageText) {
      case "Login correcto":
        return t("messages.success");
      case "Credenciales inválidas":
        return t("messages.invalidCredentials");
      default:
        return t("messages.unexpected");
    }
  }

  async function handleLogin() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await api.post<{ message?: string }>("/auth/login", {
        email,
        password,
      });

      setMessage(translateLoginMessage(response.data.message));

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(translateLoginMessage(error.response?.data?.message));
        return;
      }

      setMessage(t("messages.unexpected"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-[0_28px_90px_-54px_rgb(190_24_93_/_0.5)] backdrop-blur-sm">
        <div className="mb-6 h-1.5 w-20 rounded-full bg-linear-to-r from-primary to-rose-300" />
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-6 space-y-4">
          <Input
            placeholder={t("emailPlaceholder")}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            placeholder={t("passwordPlaceholder")}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? t("loading") : t("submit")}
          </Button>

          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-medium text-primary">
            {t("register")}
          </Link>
        </p>
      </section>
    </main>
  );
}
