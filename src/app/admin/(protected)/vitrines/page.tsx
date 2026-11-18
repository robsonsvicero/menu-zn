import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createStorefrontAction, createStorefrontProductAction, toggleStorefrontAction, updateStorefrontProductAction } from "./actions";
import { DeleteStorefrontProductButton } from "./DeleteStorefrontProductButton";

export const dynamic = "force-dynamic";

type Product = { id: string; name: string; description: string | null; image_url: string; price: number; link_url: string | null; image_path: string; is_active: boolean };
type Storefront = { id: string; title: string; slug: string; banner_image_url: string; is_active: boolean; whatsapp_number: string | null; storefront_products: Product[] };

const inputClass = "w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default async function AdminStorefrontsPage({ searchParams }: { searchParams: Promise<{ created?: string; product_created?: string; product_updated?: string; warning?: string }> }) {
  const [{ created, product_created, product_updated, warning }, supabase] = await Promise.all([searchParams, createClient()]);
  const { data, error } = await supabase.from("storefronts").select("id, title, slug, banner_image_url, is_active, whatsapp_number, storefront_products(id, name, description, image_url, image_path, price, link_url, is_active)").order("created_at", { ascending: false }).limit(100);
  const storefronts = (data ?? []) as Storefront[];

  return (
    <section className="max-w-6xl">
      <div className="mb-8">
        <h2 className="flex items-center gap-3 font-serif text-3xl"><Store size={28} className="text-primary" aria-hidden="true" />Vitrines</h2>
        <p className="mt-1 text-sm text-on-surface/70">Crie páginas de produtos para usar como destino dos seus anúncios.</p>
      </div>
      {created === "1" && <p role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-900">Vitrine cadastrada.</p>}
      {product_created === "1" && <p role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-900">Produto cadastrado.</p>}
      {product_updated === "1" && <p role="status" className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-900">Produto atualizado.</p>}
      {warning && <p role="status" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{warning}</p>}
      {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-900">Não foi possível carregar as vitrines: {error.message}. Verifique se a migração supabase/sql/16_storefronts.sql foi aplicada.</p>}

      <form action={createStorefrontAction} className="mb-10 space-y-5 rounded-2xl border border-outline bg-white p-6 md:p-8">
        <h3 className="font-serif text-2xl">Criar vitrine</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">Título<input name="title" required maxLength={120} className={`${inputClass} mt-1 font-normal`} placeholder="Ex.: Sabores da Casa" /></label>
          <label className="text-sm font-medium">Slug da página<input name="slug" required maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={`${inputClass} mt-1 font-normal`} placeholder="sabores-da-casa" /><span className="mt-1 block text-xs text-on-surface/60">Endereço: /vitrine/slug</span></label>
        </div>
          <label className="block text-sm font-medium">WhatsApp do vendedor (com DDD, apenas números)<input name="whatsapp_number" type="tel" maxLength={15} placeholder="11999999999" className={`${inputClass} mt-1 font-normal`} /></label>
          <label className="block text-sm font-medium">Imagem do banner<input name="banner_image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className={`${inputClass} mt-1 font-normal`} /><span className="mt-1 block text-xs text-on-surface/60">JPG, PNG, WebP ou AVIF, até 4 MB.</span></label>
        <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">Criar vitrine</button>
      </form>

      <h3 className="mb-4 font-serif text-2xl">Vitrines cadastradas</h3>
      <div className="space-y-5">
        {storefronts.map((storefront) => (
          <article key={storefront.id} className="overflow-hidden rounded-2xl border border-outline bg-white">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <Image src={storefront.banner_image_url} alt="" width={240} height={100} unoptimized className="h-24 w-full rounded-xl object-cover sm:w-60" />
              <div className="min-w-0 flex-1"><h4 className="font-serif text-xl">{storefront.title}</h4><Link href={`/vitrine/${storefront.slug}`} target="_blank" className="text-sm text-primary underline">/vitrine/{storefront.slug}</Link><p className="mt-1 text-xs text-on-surface/60">{storefront.whatsapp_number ? `📱 ${storefront.whatsapp_number}` : "Sem WhatsApp"}</p></div>
              <form action={toggleStorefrontAction}><input type="hidden" name="id" value={storefront.id} /><input type="hidden" name="slug" value={storefront.slug} /><input type="hidden" name="is_active" value={String(!storefront.is_active)} /><button className="rounded-lg border border-outline px-3 py-2 text-xs font-medium">{storefront.is_active ? "Desativar" : "Ativar"}</button></form>
            </div>
            <div className="border-t border-outline/70 bg-[#faf8f5] p-4 sm:p-5">
              <h5 className="mb-3 text-sm font-semibold">Produtos ({storefront.storefront_products?.length ?? 0})</h5>
              {storefront.storefront_products?.length ? (
                <ul className="mb-5 space-y-3">
                  {storefront.storefront_products.map((product) => (
                    <li key={product.id} className="rounded-xl border border-outline/70 bg-white p-3 sm:p-4">
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <Image src={product.image_url} alt="" width={96} height={96} unoptimized className="h-20 w-20 rounded-lg object-cover" />
                        <form action={updateStorefrontProductAction} encType="multipart/form-data" className="grid min-w-0 flex-1 gap-3 md:grid-cols-[1fr_1fr_1.2fr_1fr_8rem_auto] md:items-end">
                          <input type="hidden" name="id" value={product.id} /><input type="hidden" name="slug" value={storefront.slug} />
                          <label className="text-xs font-medium">Nome<input name="name" required maxLength={120} defaultValue={product.name} className={`${inputClass} mt-1 bg-white font-normal`} /></label>
                          <label className="text-xs font-medium">Descrição (máx 160 car.)<input name="description" maxLength={160} defaultValue={product.description ?? ""} className={`${inputClass} mt-1 bg-white font-normal`} placeholder="Breve descrição..." /></label>
                          <label className="text-xs font-medium">Trocar imagem<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className={`${inputClass} mt-1 bg-white font-normal`} /></label>
                          <label className="text-xs font-medium">Link do produto<input name="link_url" type="url" defaultValue={product.link_url ?? ""} className={`${inputClass} mt-1 bg-white font-normal`} placeholder="https://..." /></label>
                          <label className="text-xs font-medium">Preço (R$)<input name="price" type="number" required min="0" max="99999999" step="0.01" defaultValue={Number(product.price)} className={`${inputClass} mt-1 bg-white font-normal`} /></label>
                          <button className="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-[#faf8f5]">Salvar</button>
                        </form>
                        <div className="flex items-end"><DeleteStorefrontProductButton id={product.id} name={product.name} slug={storefront.slug} /></div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="mb-4 text-xs text-on-surface/60">Nenhum produto cadastrado ainda.</p>}
              <form action={createStorefrontProductAction} encType="multipart/form-data" className="grid gap-3 md:grid-cols-[1fr_1fr_1.2fr_1.2fr_8rem_auto] md:items-end">
                <input type="hidden" name="storefront_id" value={storefront.id} /><input type="hidden" name="slug" value={storefront.slug} />
                <label className="text-xs font-medium">Nome<input name="name" required maxLength={120} className={`${inputClass} mt-1 bg-white font-normal`} /></label>
                <label className="text-xs font-medium">Descrição (máx 160 car.)<input name="description" maxLength={160} className={`${inputClass} mt-1 bg-white font-normal`} placeholder="Breve descrição..." /></label>
                <label className="text-xs font-medium">Imagem<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className={`${inputClass} mt-1 bg-white font-normal`} /></label>
                <label className="text-xs font-medium">Link do produto (opcional)<input name="link_url" type="url" className={`${inputClass} mt-1 bg-white font-normal`} placeholder="https://..." /></label>
                <label className="text-xs font-medium">Preço (R$)<input name="price" type="number" required min="0" max="99999999" step="0.01" className={`${inputClass} mt-1 bg-white font-normal`} /></label>
                <button className="rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-white">Adicionar</button>
              </form>
            </div>
          </article>
        ))}
        {!error && storefronts.length === 0 && <p className="rounded-2xl border border-dashed border-outline bg-white px-6 py-12 text-center text-sm text-on-surface/70">Nenhuma vitrine cadastrada.</p>}
      </div>
    </section>
  );
}
