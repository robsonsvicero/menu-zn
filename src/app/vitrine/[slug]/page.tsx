import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Storefront = {
  id: string;
  slug: string;
  title: string;
  banner_image_url: string;
};

type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  link_url: string | null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("storefronts")
    .select("title")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return {
    title: data?.title ? `${data.title} | Menu Zona Norte` : "Vitrine | Menu Zona Norte",
    robots: { index: false, follow: false },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: storefrontData } = await supabase
    .from("storefronts")
    .select("id, slug, title, banner_image_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!storefrontData) notFound();
  const storefront = storefrontData as Storefront;
  const { data: productData } = await supabase
    .from("storefront_products")
    .select("id, name, image_url, price, link_url")
    .eq("storefront_id", storefront.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const products = (productData ?? []) as Product[];

  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface">
      <section className="relative isolate flex min-h-64 items-end overflow-hidden bg-neutral-900 sm:min-h-80 md:min-h-[26rem]">
        <Image
          src={storefront.banner_image_url}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-9 pt-24 sm:px-8 sm:pb-12 md:px-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Vitrine especial</p>
          <h1 className="max-w-4xl font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
            {storefront.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 md:px-12 md:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Seleção da casa</p>
            <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Produtos</h2>
          </div>
          <span className="text-sm text-on-surface/60">{products.length} {products.length === 1 ? "produto" : "produtos"}</span>
        </div>

        {products.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => {
              const card = (
                <>
                  <div className="relative aspect-square bg-[#f0ece7]">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <h3 className="line-clamp-2 min-h-11 text-sm font-semibold leading-5 sm:text-base">{product.name}</h3>
                    <p className="mt-2 font-serif text-lg font-bold text-primary sm:text-xl">
                      {Number(product.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </>
              );

              return (
                <li key={product.id} className="overflow-hidden rounded-2xl border border-outline/70 bg-white shadow-sm">
                  {product.link_url ? (
                    <a
                      href={product.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      aria-label={`${product.name} — abrir link do produto em nova aba`}
                    >
                      {card}
                    </a>
                  ) : card}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-outline bg-white px-6 py-14 text-center text-sm text-on-surface/65">
            Esta vitrine ainda não tem produtos cadastrados.
          </p>
        )}
      </section>
    </main>
  );
}
