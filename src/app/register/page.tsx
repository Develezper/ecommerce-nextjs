"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Error al registrar usuario"
        );
        return;
      }

      setMessage("Error inesperado al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Regístrate para comprar, agregar favoritos y usar el carrito.
        </p>

        <div className="mt-6 space-y-4">
          <Input
            placeholder="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <Input
            placeholder="Correo electrónico"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            className="w-full"
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrarme"}
          </Button>

          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-rose-600">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}