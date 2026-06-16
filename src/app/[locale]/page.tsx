import { getTranslations, setRequestLocale } from "next-intl/server";

import ProductCard from "@/components/products/ProductCard";
import type { AppLocale } from "@/i18n/routing";
import { localizeProductListItem } from "@/lib/product-localization";
import { getCurrentUser } from "@/lib/current-user";
import { getFavoriteProductIds } from "@/services/favorite.service";
import { getProducts } from "@/services/product.service";
import type { ProductListItem } from "@/types/product";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const activeLocale = locale as AppLocale;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Home" });
  const user = await getCurrentUser();
  const [products, favoriteProductIds] = await Promise.all([
    getProducts(),
    user ? getFavoriteProductIds(user.userId) : Promise.resolve([]),
  ]);
  const favoriteProductIdSet = new Set(favoriteProductIds);
  const localizedProducts: ProductListItem[] = products.map((product) =>
    localizeProductListItem(product, activeLocale)
  );

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

        {localizedProducts.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {localizedProducts.map((product) => (
              <ProductCard
                key={`${product._id}-${activeLocale}-${favoriteProductIdSet.has(
                  product._id
                )}`}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                shortDescription={product.shortDescription}
                initialIsFavorite={favoriteProductIdSet.has(product._id)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
