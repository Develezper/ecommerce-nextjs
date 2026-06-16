import { redirect } from "next/navigation";

import CartClient from "@/components/cart/CartClient";
import { getCurrentUser } from "@/lib/current-user";
import { getUserCart } from "@/services/cart.service";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const cart = await getUserCart(user.userId);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-600">Tu compra</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">Carrito</h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Revisa cantidades, subtotales y el total antes de continuar.
          </p>
        </div>

        <CartClient initialCart={cart} />
      </section>
    </main>
  );
}
