import Image from "next/image";
import { ExternalLink, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdvertisementAction, toggleAdvertisementAction } from "./actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

type AdvertisementRow = {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  is_active: boolean;
  created_at: string;
};

export default async function AdminAdvertisementsPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    warning?: string;
  }>;
}) {
  const [{ created, updated, deleted, warning }, supabase] = await Promise.all([
    searchParams,
    createClient(),
  ]);
  const { data, error } = await supabase
    .from("blog_advertisements")
    .select("id, title, image_url, target_url, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const advertisements = (data ?? []) as AdvertisementRow[];

  return (
    <section className="max-w-6xl">
      <div className="mb-8">
        <h2 className="flex items-center gap-3 font-serif text-3xl">
          <Megaphone size={28} className="text-primary" aria-hidden="true" />
          Anúncios do blog
        </h2>
        <p className="mt-1 text-sm text-on-surface/70">
          Cadastre e gerencie os anúncios exibidos nas matérias.
        </p>
      </div>

      {created === "1" ? (
        <p role="status" className="mb-5 rounded-xl border border-green-800/20 bg-green-50 p-4 text-sm text-green-900">
          Anúncio cadastrado com sucesso.
        </p>
      ) : null}
      {updated === "1" ? (
        <p role="status" className="mb-5 rounded-xl border border-green-800/20 bg-green-50 p-4 text-sm text-green-900">
          Anúncio atualizado com sucesso.
        </p>
      ) : null}
      {deleted === "1" ? (
        <p role="status" className="mb-5 rounded-xl border border-green-800/20 bg-green-50 p-4 text-sm text-green-900">
          Anúncio excluído.
        </p>
      ) : null}
      {warning ? (
        <p role="status" className="mb-5 rounded-xl border border-amber-800/20 bg-amber-50 p-4 text-sm text-amber-950">
          {warning}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mb-5 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar anúncios: {error.message}
        </p>
      ) : null}

      <form
        action={createAdvertisementAction}
        className="mb-10 space-y-5 rounded-2xl border border-outline bg-white p-6 md:p-8"
      >
        <h3 className="font-serif text-2xl">Cadastrar anúncio</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="ad-title" className="mb-1 block text-sm font-medium">
              Texto do produto ou serviço *
            </label>
            <input
              id="ad-title"
              name="title"
              required
              maxLength={120}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ex.: Conheça os sabores da Casa..."
            />
            <p className="mt-1 text-xs text-on-surface/60">Máximo de 120 caracteres.</p>
          </div>

          <div>
            <label htmlFor="ad-target-url" className="mb-1 block text-sm font-medium">
              Link do anúncio *
            </label>
            <input
              id="ad-target-url"
              name="target_url"
              type="url"
              required
              maxLength={2048}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="https://..."
            />
            <p className="mt-1 text-xs text-on-surface/60">O link será aberto em uma nova aba.</p>
          </div>
        </div>

        <div>
          <label htmlFor="ad-image" className="mb-1 block text-sm font-medium">
            Imagem de fundo *
          </label>
          <input
            id="ad-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            required
            className="w-full rounded-xl border border-outline px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-1.5 file:text-on-surface"
          />
          <p className="mt-1 text-xs text-on-surface/60">
            JPG, PNG, WebP ou AVIF, até 4 MB. Recomendado: 970 × 250 px.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked
            className="h-4 w-4 rounded border-outline accent-primary"
          />
          Exibir no carrossel após cadastrar
        </label>

        <div className="pt-1">
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cadastrar anúncio
          </button>
        </div>
      </form>

      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-2xl">Anúncios cadastrados</h3>
        <span className="text-sm text-on-surface/60">
          {advertisements.length} de até 100 exibidos
        </span>
      </div>

      {advertisements.length > 0 ? (
        <ul className="divide-y divide-outline/70 overflow-hidden rounded-2xl border border-outline bg-white">
          {advertisements.map((advertisement) => (
            <li key={advertisement.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center md:p-5">
              <Image
                src={advertisement.image_url}
                alt=""
                width={160}
                height={76}
                unoptimized
                className="h-20 w-full rounded-lg object-cover sm:w-40"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-on-surface">{advertisement.title}</p>
                <a
                  href={advertisement.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex max-w-full items-center gap-1 text-xs text-primary underline underline-offset-2"
                >
                  <span className="truncate">{advertisement.target_url}</span>
                  <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    advertisement.is_active
                      ? "bg-green-50 text-green-900"
                      : "bg-background text-on-surface/65"
                  }`}
                >
                  {advertisement.is_active ? "Ativo" : "Inativo"}
                </span>
                <Link
                  href={`/admin/anuncios/${advertisement.id}/editar`}
                  className="rounded-lg border border-outline px-3 py-2 text-xs font-medium transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Editar
                </Link>
                <form action={toggleAdvertisementAction}>
                  <input type="hidden" name="id" value={advertisement.id} />
                  <input
                    type="hidden"
                    name="is_active"
                    value={String(!advertisement.is_active)}
                  />
                  <button
                    type="submit"
                    className="rounded-lg border border-outline px-3 py-2 text-xs font-medium transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {advertisement.is_active ? "Desativar" : "Ativar"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : !error ? (
        <p className="rounded-2xl border border-dashed border-outline bg-white px-6 py-12 text-center text-sm text-on-surface/70">
          Nenhum anúncio cadastrado. Use o formulário acima para adicionar o primeiro.
        </p>
      ) : null}
    </section>
  );
}
