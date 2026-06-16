import { getTranslations, setRequestLocale } from "next-intl/server";

import ProductCard from "@/components/products/ProductCard";
import type { AppLocale } from "@/i18n/routing";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { localizeProductListItem } from "@/lib/product-localization";
import { getFavoriteProducts } from "@/services/favorite.service";
import type { ProductListItem } from "@/types/product";

type FavoritesPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function FavoritesPage({ params }: FavoritesPageProps) {
  const { locale } = await params;
  const activeLocale = locale as AppLocale;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Favorites" });
  const user = await getCurrentUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const favoriteProducts: ProductListItem[] = (
    await getFavoriteProducts(user.userId)
  ).map((product) => localizeProductListItem(product, activeLocale));

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-600">{t("eyebrow")}</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {t("title")}
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            {t("description")}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={`${product._id}-${activeLocale}`}
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
