"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { CartApiResponse } from "@/types/cart";

type AddToCartButtonProps = {
  productId: string;
};

export default function AddToCartButton({
  productId,
}: AddToCartButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsAdded(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAdded]);

  async function handleAddToCart() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<CartApiResponse>("/cart", {
        productId,
      });

      if (response.data.ok) {
        setIsAdded(true);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const buttonText = isLoading
    ? "Agregando..."
    : isAdded
      ? "Agregado"
      : "Agregar al carrito";

  return (
    <Button onClick={handleAddToCart} disabled={isLoading}>
      {buttonText}
    </Button>
  );
}
