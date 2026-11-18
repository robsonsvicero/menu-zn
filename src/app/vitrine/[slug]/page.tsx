import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BasketProvider from "@/components/vitrine/BasketProvider";
import BasketButton from "@/components/vitrine/BasketButton";
import BasketDrawer from "@/components/vitrine/BasketDrawer";
import ProductCard from "@/components/vitrine/ProductCard";

type Storefront = {
  id: string;
  slug: string;
  title: string;
  banner_image_url: string;
  whatsapp_number: string | null;
};

type Product = {
  id: string;
  name: string;
  description?: string | null;
  image_url: string;
  modal_image_url?: string | null;
  price: number;
  shipping_fee?: number | null;
  link_url?: string | null;
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
    .select("id, slug, title, banner_image_url, whatsapp_number")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!storefrontData) notFound();
  const storefront = storefrontData as Storefront;

  const { data: productData } = await supabase
    .from("storefront_products")
    .select("id, name, image_url, modal_image_url, price, shipping_fee, link_url, description")
    .eq("storefront_id", storefront.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const products = (productData ?? []) as Product[];

  return (
    <BasketProvider storefrontId={storefront.id}>
      <main className="min-h-screen bg-[#faf8f5] text-on-surface">
        {/* Banner */}
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

        {/* Products */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 md:px-12 md:py-16">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Seleção da casa</p>
              <h2 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">Produtos</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-on-surface/60">
                {products.length} {products.length === 1 ? "produto" : "produtos"}
              </span>
              <BasketButton />
            </div>
          </div>

          {products.length ? (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-2xl border border-dashed border-outline bg-white px-6 py-14 text-center text-sm text-on-surface/65">
              Esta vitrine ainda não tem produtos cadastrados.
            </p>
          )}
        </section>

        {/* Basket Drawer */}
        <BasketDrawer whatsappNumber={storefront.whatsapp_number ?? ""} />
      </main>
    </BasketProvider>
  );
}
