"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const t = useTranslations("Register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function translateRegisterMessage(messageText: string | undefined) {
    switch (messageText) {
      case "Usuario registrado correctamente":
        return t("messages.success");
      case "El correo ya está registrado":
        return t("messages.emailRegistered");
      default:
        return t("messages.unexpected");
    }
  }

  async function handleRegister() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await api.post<{ message?: string }>("/auth/register", {
        name,
        email,
        password,
      });

      setMessage(translateRegisterMessage(response.data.message));

      setName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(translateRegisterMessage(error.response?.data?.message));
        return;
      }

      setMessage(t("messages.unexpected"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">{t("title")}</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("description")}
        </p>

        <div className="mt-6 space-y-4">
          <Input
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

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

          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? t("loading") : t("submit")}
          </Button>

          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-rose-600">
            {t("login")}
          </Link>
        </p>
      </section>
    </main>
  );
}
