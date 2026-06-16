import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ecommerce Next.js",
  description:
    "Full-stack E-commerce simulator built with Next.js, 3-language i18n (EN/ES/PT), automated transactional emails, and a daily sales report cron job.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
