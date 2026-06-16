import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import AddToCartButton from "@/components/cart/AddToCartButton";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { formatCurrencyCOP } from "@/lib/formatters";
import { localizeProductDetail } from "@/lib/product-localization";
import { getProductById } from "@/services/product.service";
import type { ProductDetail } from "@/types/product";

type ProductDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, id } = await params;
  const activeLocale = locale as AppLocale;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "ProductDetail" });
  const product: ProductDetail | null = await getProductById(id);

  if (!product) {
    notFound();
  }

  const localizedProduct = localizeProductDetail(product, activeLocale);

  const formattedPrice = formatCurrencyCOP(localizedProduct.price);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div className="relative h-112.5 overflow-hidden rounded-[2rem] border border-primary/10 bg-white/70 shadow-[0_28px_80px_-48px_rgb(190_24_93_/_0.48)]">
          <Image
            src={localizedProduct.image}
            alt={localizedProduct.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6 rounded-[2rem] border border-white/70 bg-white/72 p-8 shadow-[0_22px_80px_-52px_rgb(190_24_93_/_0.45)] backdrop-blur-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {t("eyebrow")}
            </p>

            <h1 className="mt-2 text-3xl font-bold">{localizedProduct.name}</h1>

            <p className="mt-4 text-2xl font-bold text-primary">
              {formattedPrice}
            </p>
          </div>

          <p className="text-muted-foreground">{localizedProduct.description}</p>

          <div>
            <h2 className="mb-3 text-lg font-semibold">
              {t("specifications")}
            </h2>

            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {localizedProduct.specifications.map((specification) => (
                <li key={specification}>{specification}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-accent/50 p-4">
            <p className="font-medium text-secondary-foreground">
              {t("stockTitle")}
            </p>
            <p className="text-muted-foreground">
              {t("stockUnits", { count: localizedProduct.stock })}
            </p>
          </div>

          <div className="flex gap-4">
            <AddToCartButton productId={localizedProduct._id} />

            <Button variant="outline" asChild>
              <Link href="/">{t("back")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
