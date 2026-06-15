import { cookies } from "next/headers";
import Link from "next/link";

import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { verifyAuthToken } from "@/lib/auth";

export default async function Navbar() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  const user = token ? await verifyAuthToken(token) : null;

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-rose-600">
          Beauty Store
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">Productos</Link>
          <Link href="/favorites">Favoritos</Link>
          <Link href="/cart">Carrito</Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Hola, {user.name}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>

              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}