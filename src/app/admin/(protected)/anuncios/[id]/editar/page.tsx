import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DeleteAdvertisementButton } from "../../DeleteAdvertisementButton";
import { updateAdvertisementAction } from "../../actions";

export const dynamic = "force-dynamic";

type Advertisement = {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  is_active: boolean;
};

export default async function EditAdvertisementPage({
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
    .from("blog_advertisements")
    .select("id, title, image_url, target_url, is_active")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Não foi possível carregar o anúncio: ${error.message}`);
  }

  if (!data) {
    notFound();
  }

  const advertisement = data as Advertisement;

  return (
    <section className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl">Editar anúncio</h2>
          <p className="mt-1 text-sm text-on-surface/70">
            Atualize o texto, o destino, a imagem ou o status do card.
          </p>
        </div>
        <DeleteAdvertisementButton
          id={advertisement.id}
          title={advertisement.title}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:opacity-50"
        />
      </div>

      {actionError ? (
        <p role="alert" className="mb-5 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          {actionError}
        </p>
      ) : null}

      <form
        action={updateAdvertisementAction}
        encType="multipart/form-data"
        className="space-y-5 rounded-2xl border border-outline bg-white p-6 md:p-8"
      >
        <input type="hidden" name="id" value={advertisement.id} />

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
              defaultValue={advertisement.title}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              defaultValue={advertisement.target_url}
              className="w-full rounded-xl border border-outline px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-on-surface/60">O link será aberto em uma nova aba.</p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Imagem atual</p>
          <Image
            src={advertisement.image_url}
            alt=""
            width={970}
            height={250}
            unoptimized
            className="aspect-[97/25] w-full max-w-[970px] rounded-xl object-cover"
          />
        </div>

        <div>
          <label htmlFor="ad-image" className="mb-1 block text-sm font-medium">
            Substituir imagem
          </label>
          <input
            id="ad-image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="w-full rounded-xl border border-outline px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-1.5 file:text-on-surface"
          />
          <p className="mt-1 text-xs text-on-surface/60">
            Opcional. JPG, PNG, WebP ou AVIF, até 4 MB; recomendado: 970 × 250 px.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={advertisement.is_active}
            className="h-4 w-4 rounded border-outline accent-primary"
          />
          Exibir este anúncio no carrossel
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Salvar alterações
          </button>
          <Link
            href="/admin/anuncios"
            className="rounded-xl border border-outline px-5 py-2.5 text-sm transition-colors hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
