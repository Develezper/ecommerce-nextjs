"use client";

import axios from "axios";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useRouter } from "@/i18n/navigation";
import { formatCurrencyCOP } from "@/lib/formatters";
import { api } from "@/lib/api";
import type { CartApiResponse, CartResponse } from "@/types/cart";
import type { CheckoutSaleApiResponse } from "@/types/sale";

type CartClientProps = {
  initialCart: CartResponse;
};

type CartErrorResponse = {
  message?: string;
};

type FeedbackState =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

function getCartState(data: CartApiResponse): CartResponse {
  return {
    products: data.products,
    total: data.total,
  };
}

export default function CartClient({ initialCart }: CartClientProps) {
  const router = useRouter();
  const t = useTranslations("Cart");

  const [cart, setCart] = useState<CartResponse>(initialCart);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"update" | "remove" | null>(
    null
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  function translateCartMessage(
    message: string | undefined,
    fallbackMessage: string
  ) {
    switch (message) {
      case "Debes iniciar sesión":
        return t("feedback.authRequired");
      case "El carrito está vacío":
        return t("feedback.emptyCartError");
      case "La cantidad debe ser mayor a 0":
        return t("feedback.invalidQuantity");
      case "Producto no encontrado":
      case "Producto no encontrado en el carrito":
        return t("feedback.productNotFound");
      default:
        return fallbackMessage;
    }
  }

  function getErrorMessage(error: unknown, fallbackMessage: string) {
    if (axios.isAxiosError<CartErrorResponse>(error)) {
      return translateCartMessage(error.response?.data?.message, fallbackMessage);
    }

    return fallbackMessage;
  }

  async function handleQuantityChange(productId: string, quantity: number) {
    if (pendingProductId || isCheckingOut || quantity < 1) {
      return;
    }

    setPendingProductId(productId);
    setPendingAction("update");
    setFeedback(null);

    try {
      const response = await api.patch<CartApiResponse>(`/cart/${productId}`, {
        quantity,
      });

      setCart(getCartState(response.data));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      setFeedback({
        type: "error",
        text: getErrorMessage(error, t("feedback.updateError")),
      });
    } finally {
      setPendingProductId(null);
      setPendingAction(null);
    }
  }

  async function handleRemoveProduct(productId: string) {
    if (pendingProductId || isCheckingOut) {
      return;
    }

    setPendingProductId(productId);
    setPendingAction("remove");
    setFeedback(null);

    try {
      const response = await api.delete<CartApiResponse>(`/cart/${productId}`);

      setCart(getCartState(response.data));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      setFeedback({
        type: "error",
        text: getErrorMessage(error, t("feedback.removeError")),
      });
    } finally {
      setPendingProductId(null);
      setPendingAction(null);
    }
  }

  async function handleCheckout() {
    if (pendingProductId || isCheckingOut || cart.products.length === 0) {
      return;
    }

    setIsCheckingOut(true);
    setFeedback(null);

    try {
      const response = await api.post<CheckoutSaleApiResponse>("/sales/checkout");

      setCart({
        products: [],
        total: 0,
      });
      setFeedback({
        type: "success",
        text: translateCartMessage(
          response.data.message,
          t("feedback.checkoutSuccess")
        ),
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        router.push("/login");
        return;
      }

      setFeedback({
        type: "error",
        text: getErrorMessage(error, t("feedback.checkoutError")),
      });
    } finally {
      setIsCheckingOut(false);
    }
  }

  const feedbackContent = feedback ? (
    <p
      className={`rounded-xl px-4 py-3 text-sm ${
        feedback.type === "success"
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border border-destructive/20 bg-destructive/5 text-destructive"
      }`}
    >
      {feedback.text}
    </p>
  ) : null;

  if (cart.products.length === 0) {
    return (
      <Card className="border border-primary/10 bg-white/78 shadow-[0_24px_80px_-54px_rgb(190_24_93_/_0.48)]">
        <CardContent className="py-10 text-center">
          {feedbackContent ? <div className="mb-6">{feedbackContent}</div> : null}

          <p className="text-lg font-semibold">{t("emptyTitle")}</p>
          <p className="mt-2 text-muted-foreground">
            {t("emptyDescription")}
          </p>

          <Button asChild className="mt-6">
            <Link href="/">{t("viewProducts")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {feedbackContent}

        {cart.products.map((product) => {
          const isCurrentProduct = pendingProductId === product._id;
          const isBusy = pendingProductId !== null || isCheckingOut;

          return (
            <Card
              key={product._id}
              className="border border-primary/10 bg-white/82 shadow-[0_24px_80px_-54px_rgb(190_24_93_/_0.4)]"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-primary/10 sm:w-28">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {product.name}
                        </h2>

                        <p className="text-sm text-muted-foreground">
                          {t("price")}: {formatCurrencyCOP(product.price)}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-muted-foreground">
                          {t("subtotal")}
                        </p>
                        <p className="text-base font-semibold text-primary">
                          {formatCurrencyCOP(product.subtotal)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-accent/55 px-2 py-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              product.quantity - 1
                            )
                          }
                          disabled={isBusy || product.quantity === 1}
                          aria-label={t("decreaseQuantity", {
                            name: product.name,
                          })}
                        >
                          -
                        </Button>

                        <span className="min-w-10 text-center text-sm font-medium">
                          {product.quantity}
                        </span>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            handleQuantityChange(
                              product._id,
                              product.quantity + 1
                            )
                          }
                          disabled={isBusy}
                          aria-label={t("increaseQuantity", {
                            name: product.name,
                          })}
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveProduct(product._id)}
                        disabled={isBusy}
                      >
                        {isCurrentProduct && pendingAction === "remove"
                          ? t("removing")
                          : t("remove")}
                      </Button>

                      {isCurrentProduct && pendingAction === "update" ? (
                        <p className="text-sm text-muted-foreground">
                          {t("updating")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="h-fit border border-primary/10 bg-white/82 shadow-[0_24px_80px_-54px_rgb(190_24_93_/_0.4)]">
        <CardHeader>
          <CardTitle>{t("summaryTitle")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{t("products")}</span>
            <span>{cart.products.length}</span>
          </div>

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>{t("total")}</span>
            <span className="text-primary">{formatCurrencyCOP(cart.total)}</span>
          </div>

          <p className="text-sm text-muted-foreground">{t("helper")}</p>

          <Button
            type="button"
            className="w-full"
            onClick={handleCheckout}
            disabled={isCheckingOut || pendingProductId !== null}
          >
            {isCheckingOut ? t("processing") : t("checkout")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
