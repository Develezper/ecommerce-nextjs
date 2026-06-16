"use client";
import axios from "axios";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { formatCurrencyCOP } from "@/lib/formatters";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  initialIsFavorite?: boolean;
};

type ToggleFavoriteResponse = {
  ok: boolean;
  favorite: {
    productId: string;
    isFavorite: boolean;
  };
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  shortDescription,
  initialIsFavorite = false,
}: ProductCardProps) {
  const router = useRouter();
  const t = useTranslations("ProductCard");
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const formattedPrice = formatCurrencyCOP(price);

  async function handleToggleFavorite() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<ToggleFavoriteResponse>("/favorites", {
        productId: id,
      });

      const nextIsFavorite = response.data.favorite.isFavorite;

      setIsFavorite(nextIsFavorite);
      router.refresh();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="group overflow-hidden rounded-[1.75rem] border border-primary/10 bg-linear-to-b from-white via-white to-accent/55 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_-42px_rgb(190_24_93_/_0.45)]">
      <CardHeader className="relative h-64 p-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/10 to-transparent" />

        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/90 p-2 text-secondary-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
          aria-label={t("favoriteButton")}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-primary text-primary" : "text-secondary-foreground/70"
            }`}
          />
        </button>
      </CardHeader>

      <CardContent className="space-y-3 p-5">
        <div className="inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Beauty Pick
        </div>

        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
          {name}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {shortDescription}
        </p>

        <p className="text-lg font-bold text-primary">{formattedPrice}</p>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${id}`}>{t("viewDetail")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
