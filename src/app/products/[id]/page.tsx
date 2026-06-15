import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getProductById } from "@/services/product.service";
import type { ProductDetail } from "@/types/product";
import { formatCurrencyCOP } from "@/lib/formatters";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product: ProductDetail | null = await getProductById(id);

  if (!product) {
    notFound();
  }
  
  const formattedPrice = formatCurrencyCOP(product.price);

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <div className="relative h-[450px] overflow-hidden rounded-2xl border">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-rose-600">
              Detalle del producto
            </p>

            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

            <p className="mt-4 text-2xl font-bold text-rose-600">
              {formattedPrice}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <h2 className="mb-3 text-lg font-semibold">Especificaciones</h2>

            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              {product.specifications.map((specification) => (
                <li key={specification}>{specification}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border p-4">
            <p className="font-medium">Stock disponible</p>
            <p className="text-muted-foreground">{product.stock} unidades</p>
          </div>

          <div className="flex gap-4">
            <Button>Agregar al carrito</Button>

            <Button variant="outline" asChild>
              <Link href="/">Volver</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}