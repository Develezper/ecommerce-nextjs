import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/services/product.service";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
};

export default async function HomePage() {
  const products: Product[] = await getProducts();

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-rose-600">
            Belleza y cuidado personal
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Productos destacados
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explora nuestra selección de productos de belleza, cuidado facial y
            fragancias.
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-muted-foreground">No hay productos disponibles.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                shortDescription={product.shortDescription}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}