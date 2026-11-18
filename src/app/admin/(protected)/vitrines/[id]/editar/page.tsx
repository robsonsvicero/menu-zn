import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Store, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateStorefrontAction } from "../../actions";
import { DeleteStorefrontButton } from "../../DeleteStorefrontButton";

export const dynamic = "force-dynamic";

type Storefront = {
  id: string;
  title: string;
  slug: string;
  banner_image_url: string;
  whatsapp_number: string | null;
  is_active: boolean;
};

const inputClass =
  "w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default async function EditStorefrontPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error: actionError }, supabase] = await Promise.all([
    params,
    searchParams,
    createClient(),
  ]);

  const { data, error } = await supabase
    .from("storefronts")
    .select("id, title, slug, banner_image_url, whatsapp_number, is_active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar a vitrine: ${error.message}`);
  }

  if (!data) {
    notFound();
  }

  const storefront = data as Storefront;

  return (
    <section className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/vitrines"
            className="mb-2 inline-flex items-center gap-1.5 text-xs text-on-surface/70 hover:text-primary"
          >
            <ArrowLeft size={14} /> Voltar para vitrines
          </Link>
          <h2 className="flex items-center gap-2.5 font-serif text-3xl">
            <Store size={26} className="text-primary" />
            Editar vitrine
          </h2>
          <p className="mt-1 text-sm text-on-surface/70">
            Atualize o título, slug, WhatsApp do vendedor, banner e status da vitrine.
          </p>
        </div>
        <DeleteStorefrontButton id={storefront.id} title={storefront.title} />
      </div>

      {actionError && (
        <p
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
        >
          {actionError}
        </p>
      )}

      <form
        action={updateStorefrontAction}
        encType="multipart/form-data"
        className="space-y-5 rounded-2xl border border-outline bg-white p-6 md:p-8"
      >
        <input type="hidden" name="id" value={storefront.id} />

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">
            Título *
            <input
              name="title"
              required
              maxLength={120}
              defaultValue={storefront.title}
              className={`${inputClass} mt-1 font-normal`}
              placeholder="Ex.: Sabores da Casa"
            />
          </label>

          <label className="text-sm font-medium">
            Slug da página *
            <input
              name="slug"
              required
              maxLength={80}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              defaultValue={storefront.slug}
              className={`${inputClass} mt-1 font-normal`}
              placeholder="sabores-da-casa"
            />
            <span className="mt-1 block text-xs text-on-surface/60">
              Endereço: /vitrine/{storefront.slug}
            </span>
          </label>
        </div>

        <label className="block text-sm font-medium">
          WhatsApp do vendedor (com DDD, apenas números)
          <input
            name="whatsapp_number"
            type="tel"
            maxLength={15}
            defaultValue={storefront.whatsapp_number ?? ""}
            className={`${inputClass} mt-1 font-normal`}
            placeholder="11999999999"
          />
          <span className="mt-1 block text-xs text-on-surface/60">
            Os pedidos da cesta desta vitrine serão enviados diretamente para este WhatsApp.
          </span>
        </label>

        <div>
          <p className="mb-2 text-sm font-medium">Banner atual</p>
          <div className="relative h-44 w-full overflow-hidden rounded-xl border border-outline/70">
            <Image
              src={storefront.banner_image_url}
              alt={storefront.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>

        <label className="block text-sm font-medium">
          Substituir banner (opcional)
          <input
            name="banner_image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className={`${inputClass} mt-1 font-normal`}
          />
          <span className="mt-1 block text-xs text-on-surface/60">
            JPG, PNG, WebP ou AVIF, até 4 MB. Deixe vazio para manter o atual.
          </span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={storefront.is_active}
            className="h-4 w-4 rounded border-outline accent-primary"
          />
          Vitrine ativa (visível publicamente)
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Salvar alterações
          </button>
          <Link
            href="/admin/vitrines"
            className="rounded-xl border border-outline px-5 py-2.5 text-sm font-medium hover:bg-neutral-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
