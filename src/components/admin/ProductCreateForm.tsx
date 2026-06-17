"use client";

import Image from "next/image";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, axios } from "@/lib/api";
import { cn } from "@/lib/utils";

type ProductFormFields = {
  name: string;
  price: string;
  shortDescription: string;
  description: string;
  specifications: string;
  stock: string;
};

type CreateProductResponse = {
  message?: string;
};

type MessageTone = "error" | "success";

const initialFormValues: ProductFormFields = {
  name: "",
  price: "",
  shortDescription: "",
  description: "",
  specifications: "",
  stock: "",
};

export function ProductCreateForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [formValues, setFormValues] = useState<ProductFormFields>(
    initialFormValues
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<MessageTone>("success");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const nextImage = event.target.files?.[0] ?? null;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setImageFile(nextImage);
    if (!nextImage) {
      setImagePreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(nextImage);
    previewUrlRef.current = nextPreviewUrl;
    setImagePreviewUrl(nextPreviewUrl);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!imageFile) {
      setMessage("Debes seleccionar una imagen");
      setMessageTone("error");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("name", formValues.name);
      formData.append("price", formValues.price);
      formData.append("shortDescription", formValues.shortDescription);
      formData.append("description", formValues.description);
      formData.append("specifications", formValues.specifications);
      formData.append("stock", formValues.stock);
      formData.append("image", imageFile);

      const response = await api.post<CreateProductResponse>("/products", formData);

      setFormValues(initialFormValues);
      setImageFile(null);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setImagePreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage(response.data.message ?? "Producto creado correctamente");
      setMessageTone("success");
    } catch (error: unknown) {
      if (axios.isAxiosError<CreateProductResponse>(error)) {
        setMessage(error.response?.data?.message ?? "No se pudo crear el producto");
        setMessageTone("error");
        return;
      }

      setMessage("No se pudo crear el producto");
      setMessageTone("error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[2rem] border border-white/70 bg-white/82 p-8 shadow-[0_28px_90px_-54px_rgb(190_24_93_/_0.5)] backdrop-blur-sm"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="product-name" className="text-sm font-medium">
            Nombre
          </label>
          <Input
            id="product-name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="product-price" className="text-sm font-medium">
            Precio
          </label>
          <Input
            id="product-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formValues.price}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="product-stock" className="text-sm font-medium">
            Stock
          </label>
          <Input
            id="product-stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formValues.stock}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="product-short-description"
            className="text-sm font-medium"
          >
            Descripción corta
          </label>
          <Input
            id="product-short-description"
            name="shortDescription"
            value={formValues.shortDescription}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="product-description" className="text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="product-description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="min-h-28 w-full rounded-[1.5rem] border border-input bg-white/85 px-4 py-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="product-specifications"
            className="text-sm font-medium"
          >
            Especificaciones
          </label>
          <textarea
            id="product-specifications"
            name="specifications"
            value={formValues.specifications}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Una por línea o separadas por comas"
            className="min-h-28 w-full rounded-[1.5rem] border border-input bg-white/85 px-4 py-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="product-image" className="text-sm font-medium">
            Imagen
          </label>
          <Input
            id="product-image"
            name="image"
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isLoading}
            required
          />
          {imagePreviewUrl ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-pink-100 bg-pink-50/40 p-3">
              <p className="mb-3 text-sm text-muted-foreground">
                Vista previa de la imagen seleccionada
              </p>
              <Image
                src={imagePreviewUrl}
                alt="Vista previa de la imagen del producto"
                width={800}
                height={512}
                unoptimized
                className="h-64 w-full rounded-[1.25rem] object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creando producto..." : "Crear producto"}
      </Button>

      {message && (
        <p
          className={cn(
            "rounded-2xl px-4 py-3 text-sm",
            messageTone === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          )}
          role={messageTone === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
