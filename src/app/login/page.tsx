"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    try {
      setIsLoading(true);
      setMessage("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setMessage(response.data.message);

      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Error al iniciar sesión");
        return;
      }

      setMessage("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa para comprar, agregar favoritos y usar el carrito.
        </p>

        <div className="mt-6 space-y-4">
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

          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>

          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-medium text-rose-600">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}