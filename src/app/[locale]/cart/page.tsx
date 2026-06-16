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

        <CartClient initialCart={cart} />
      </section>
    </main>
  );
}
