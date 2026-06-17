import { redirect } from "next/navigation";

import { ProductCreateForm } from "@/components/admin/ProductCreateForm";
import { getCurrentUser } from "@/lib/current-user";

type ProductCreatePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProductCreatePage({
  params,
}: ProductCreatePageProps) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  if (user.role !== "admin") {
    redirect(`/${locale}`);
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-3xl space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold">Crear producto</h1>
          <p className="mt-2 text-muted-foreground">
            Sube una imagen a Cloudinary y guarda en MongoDB solo la URL pública.
          </p>
        </div>

        <ProductCreateForm />
      </section>
    </main>
  );
}
