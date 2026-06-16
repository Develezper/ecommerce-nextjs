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

      if (initialIsFavorite && !nextIsFavorite) {
        router.refresh();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border shadow-sm transition hover:shadow-md">
      <CardHeader className="relative h-64 p-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />

        <button
          type="button"
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow transition hover:scale-105"
          aria-label={t("favoriteButton")}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"
            }`}
          />
        </button>
      </CardHeader>

      <CardContent className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold">{name}</h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {shortDescription}
        </p>

        <p className="text-lg font-bold text-rose-600">{formattedPrice}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/products/${id}`}>{t("viewDetail")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
