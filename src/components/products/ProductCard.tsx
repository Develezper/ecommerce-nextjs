"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  shortDescription,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);

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
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute right-3 top-3 rounded-full bg-white p-2 shadow transition hover:scale-105"
          aria-label="Agregar a favoritos"
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
          <Link href={`/products/${id}`}>Ver detalle</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}