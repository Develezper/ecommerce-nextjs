"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center gap-1 rounded-full border px-1 py-1"
      aria-label={t("label")}
    >
      {routing.locales.map((nextLocale) => {
        const isActive = locale === nextLocale;

        return (
          <button
            key={nextLocale}
            type="button"
            onClick={() => {
              if (isActive) {
                return;
              }

              startTransition(() => {
                router.replace(pathname, { locale: nextLocale });
              });
            }}
            disabled={isPending}
            className={`rounded-full px-2 py-1 text-xs font-medium transition ${
              isActive
                ? "bg-rose-600 text-white"
                : "text-muted-foreground hover:bg-rose-50 hover:text-foreground"
            }`}
          >
            {t(nextLocale)}
          </button>
        );
      })}
    </div>
  );
}
