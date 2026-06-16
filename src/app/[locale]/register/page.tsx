"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { useState } from "react";

import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import {
  AUTH_FEEDBACK_STORAGE_KEY,
  AUTH_REGISTERED_FEEDBACK,
} from "@/lib/auth-feedback";
import {
  isValidEmail,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth-validation";
import { cn } from "@/lib/utils";

type RegisterField = "confirmPassword" | "email" | "name" | "password";
type MessageTone = "error" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("Register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("error");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<RegisterField, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  function translateRegisterMessage(messageText: string | undefined) {
    switch (messageText) {
      case "Usuario registrado correctamente":
        return t("messages.success");
      case "El correo ya está registrado":
        return t("messages.emailRegistered");
      case "Debes completar todos los campos":
        return t("messages.requiredFields");
      case "El nombre debe tener al menos 2 caracteres":
        return t("messages.nameTooShort");
      case "Ingresa un correo válido":
        return t("messages.invalidEmail");
      case "La contraseña debe tener al menos 8 caracteres":
        return t("messages.passwordTooShort");
      default:
        return t("messages.unexpected");
    }
  }

  function clearFieldError(field: RegisterField) {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: "",
    }));
  }

  function validateForm() {
    const nextFieldErrors: Partial<Record<RegisterField, string>> = {};

    if (!name.trim()) {
      nextFieldErrors.name = t("messages.nameRequired");
    } else if (name.trim().length < MIN_NAME_LENGTH) {
      nextFieldErrors.name = t("messages.nameTooShort");
    }

    if (!email.trim()) {
      nextFieldErrors.email = t("messages.emailRequired");
    } else if (!isValidEmail(email)) {
      nextFieldErrors.email = t("messages.invalidEmail");
    }

    if (!password) {
      nextFieldErrors.password = t("messages.passwordRequired");
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      nextFieldErrors.password = t("messages.passwordTooShort");
    }

    if (!confirmPassword) {
      nextFieldErrors.confirmPassword = t("messages.confirmPasswordRequired");
    } else if (confirmPassword !== password) {
      nextFieldErrors.confirmPassword = t("messages.passwordMismatch");
    }

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      setMessage(t("messages.fixErrors"));
      setMessageTone("error");
      return false;
    }

    return true;
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      setFieldErrors({});

      const response = await api.post<{ message?: string }>("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setMessage(translateRegisterMessage(response.data.message));
      setMessageTone("success");
      window.sessionStorage.setItem(
        AUTH_FEEDBACK_STORAGE_KEY,
        AUTH_REGISTERED_FEEDBACK
      );
      router.replace("/login");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(translateRegisterMessage(error.response?.data?.message));
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

        <form className="mt-6 space-y-4" onSubmit={handleRegister} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="register-name"
              className="text-sm font-medium text-foreground"
            >
              {t("nameLabel")}
            </label>

            <Input
              id="register-name"
              placeholder={t("namePlaceholder")}
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
              disabled={isLoading}
            />

            {fieldErrors.name && (
              <p
                id="register-name-error"
                className="text-sm text-destructive"
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="register-email"
              className="text-sm font-medium text-foreground"
            >
              {t("emailLabel")}
            </label>

            <Input
              id="register-email"
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
              aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
              disabled={isLoading}
            />

            {fieldErrors.email && (
              <p
                id="register-email-error"
                className="text-sm text-destructive"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <PasswordField
              id="register-password"
              label={t("passwordLabel")}
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError("password");
                clearFieldError("confirmPassword");
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "register-password-error" : "register-password-hint"
              }
              disabled={isLoading}
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
            />

            <p
              id="register-password-hint"
              className="text-xs text-muted-foreground"
            >
              {t("passwordHint")}
            </p>

            {fieldErrors.password && (
              <p
                id="register-password-error"
                className="text-sm text-destructive"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <PasswordField
              id="register-confirm-password"
              label={t("confirmPasswordLabel")}
              placeholder={t("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearFieldError("confirmPassword");
              }}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword
                  ? "register-confirm-password-error"
                  : undefined
              }
              disabled={isLoading}
              showLabel={t("showPassword")}
              hideLabel={t("hidePassword")}
            />

            {fieldErrors.confirmPassword && (
              <p
                id="register-confirm-password-error"
                className="text-sm text-destructive"
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            type="submit"
            disabled={isLoading}
          >
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
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-primary">
            {t("login")}
          </Link>
        </p>
      </section>
    </main>
  );
}
