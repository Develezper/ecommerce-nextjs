import { cookies } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import LogoutButton from "@/components/auth/LogoutButton";
import LocaleSwitcher from "@/components/layout/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { verifyAuthToken } from "@/lib/auth";

export default async function Navbar() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Navbar" });
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  const user = token ? await verifyAuthToken(token) : null;

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-rose-600">
          {t("brand")}
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/">{t("products")}</Link>
          <Link href="/favorites">{t("favorites")}</Link>
          <Link href="/cart">{t("cart")}</Link>
          <LocaleSwitcher />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {t("greeting", { name: user.name })}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>

              <Button asChild>
                <Link href="/register">{t("register")}</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
