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
      className="flex items-center gap-1 rounded-full border border-border bg-white/80 px-1 py-1 shadow-sm"
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
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {t(nextLocale)}
          </button>
        );
      })}
    </div>
  );
}
