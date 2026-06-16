"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import {
  AUTH_FEEDBACK_STORAGE_KEY,
  AUTH_REGISTERED_FEEDBACK,
} from "@/lib/auth-feedback";
import { isValidEmail } from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

type LoginField = "email" | "password";
type MessageTone = "error" | "success";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("error");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<LoginField, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const feedback = window.sessionStorage.getItem(AUTH_FEEDBACK_STORAGE_KEY);

    if (feedback !== AUTH_REGISTERED_FEEDBACK) {
      return;
    }

    setMessage(t("messages.registerSuccess"));
    setMessageTone("success");
    window.sessionStorage.removeItem(AUTH_FEEDBACK_STORAGE_KEY);
  }, [t]);

  function translateLoginMessage(messageText: string | undefined) {
    switch (messageText) {
      case "Login correcto":
        return t("messages.success");
      case "Credenciales inválidas":
        return t("messages.invalidCredentials");
      case "Debes completar correo y contraseña":
        return t("messages.requiredFields");
      case "Ingresa un correo válido":
        return t("messages.invalidEmail");
      default:
        return t("messages.unexpected");
    }
  }

  function clearFieldError(field: LoginField) {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const nextFieldErrors: Partial<Record<LoginField, string>> = {};

    if (!email.trim()) {
      nextFieldErrors.email = t("messages.emailRequired");
    } else if (!isValidEmail(email)) {
      nextFieldErrors.email = t("messages.invalidEmail");
    }

    if (!password) {
      nextFieldErrors.password = t("messages.passwordRequired");
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      setMessage(t("messages.fixErrors"));
      setMessageTone("error");
      return false;
    }

    return true;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      setFieldErrors({});

      const response = await api.post<{ message?: string }>("/auth/login", {
        email: email.trim(),
        password,
      });

      setMessage(translateLoginMessage(response.data.message));
      setMessageTone("success");

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(translateLoginMessage(error.response?.data?.message));
        setMessageTone("error");
        return;
      }

      setMessage(t("messages.unexpected"));
      setMessageTone("error");
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

        <form className="mt-6 space-y-4" onSubmit={handleLogin} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-foreground"
            >
              {t("emailLabel")}
            </label>

            <Input
              id="login-email"
              placeholder={t("emailPlaceholder")}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
              disabled={isLoading}
            />

            {fieldErrors.email && (
              <p id="login-email-error" className="text-sm text-destructive">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <PasswordField
              id="login-password"
              label={t("passwordLabel")}
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError("password");
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
              disabled={isLoading}
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
            />

            {fieldErrors.password && (
              <p id="login-password-error" className="text-sm text-destructive">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? t("loading") : t("submit")}
          </Button>

          {message && (
            <p
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                messageTone === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              )}
              role={messageTone === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </form>

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
