import { redirect } from "next/navigation";

import ProductCard from "@/components/products/ProductCard";
import { getCurrentUser } from "@/lib/current-user";
import { getFavoriteProducts } from "@/services/favorite.service";
import type { ProductListItem } from "@/types/product";

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const favoriteProducts: ProductListItem[] = await getFavoriteProducts(
    user.userId
  );

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-600">Tu selección</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">Favoritos</h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Revisa los productos que guardaste para verlos más tarde.
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <p className="text-muted-foreground">
            Aún no tienes productos favoritos.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                shortDescription={product.shortDescription}
                initialIsFavorite
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
