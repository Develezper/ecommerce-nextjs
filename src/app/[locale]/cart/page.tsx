import { getTranslations, setRequestLocale } from "next-intl/server";

import CartClient from "@/components/cart/CartClient";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getUserCart } from "@/services/cart.service";

type CartPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Cart" });
  const user = await getCurrentUser();

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const cart = await getUserCart(user.userId);

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_22px_80px_-52px_rgb(190_24_93_/_0.45)] backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            {t("eyebrow")}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <CartClient initialCart={cart} />
      </section>
    </main>
  );
}
