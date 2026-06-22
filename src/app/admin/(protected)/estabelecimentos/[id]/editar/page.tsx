import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateEstablishmentAction } from "../../actions";

export const dynamic = "force-dynamic";

type OptionRow = { id: string; name: string };

type Establishment = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  neighborhood_id: string | null;
  short_description: string | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  website_url: string | null;
  instagram_url: string | null;
  image_cover_url: string | null;
  has_ifood: boolean;
  is_featured: boolean;
  is_indicated: boolean;
  status: "draft" | "published" | "archived";
};

export default async function EditarEstabelecimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: item }, { data: categories }, { data: neighborhoods }] = await Promise.all([
    supabase
      .from("establishments")
      .select(
        "id, name, slug, category_id, neighborhood_id, short_description, description, address, phone, whatsapp, website_url, instagram_url, image_cover_url, has_ifood, is_featured, is_indicated, status"
      )
      .eq("id", id)
      .single(),
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("neighborhoods").select("id, name").order("name"),
  ]);

  if (!item) {
    notFound();
  }

  const establishment = item as Establishment;
  const categoryOptions = (categories ?? []) as OptionRow[];
  const neighborhoodOptions = (neighborhoods ?? []) as OptionRow[];

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif">Editar estabelecimento</h2>
        <p className="text-sm text-on-surface/70 mt-1">Atualize os dados do estabelecimento selecionado.</p>
      </div>

      <form action={updateEstablishmentAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <input type="hidden" name="id" value={establishment.id} />
        <input type="hidden" name="current_image_cover_url" value={establishment.image_cover_url ?? ""} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome *</label>
            <input name="name" required defaultValue={establishment.name} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input name="slug" defaultValue={establishment.slug} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Categoria *</label>
            <select name="category_id" required defaultValue={establishment.category_id} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Bairro</label>
            <select name="neighborhood_id" defaultValue={establishment.neighborhood_id ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="">Selecione...</option>
              {neighborhoodOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Resumo</label>
          <input name="short_description" defaultValue={establishment.short_description ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm mb-1">Descrição</label>
          <textarea name="description" rows={4} defaultValue={establishment.description ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Endereço</label>
            <input name="address" defaultValue={establishment.address ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <input name="phone" defaultValue={establishment.phone ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm mb-1">WhatsApp</label>
            <input name="whatsapp" defaultValue={establishment.whatsapp ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input name="website_url" defaultValue={establishment.website_url ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Instagram</label>
            <input name="instagram_url" defaultValue={establishment.instagram_url ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">URL da imagem de capa</label>
          <input name="image_cover_url" defaultValue={establishment.image_cover_url ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm mb-1">Upload da imagem de capa</label>
          <input
            type="file"
            name="image_file"
            accept="image/*"
            className="w-full rounded-xl border border-outline px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-1.5"
          />
          <p className="mt-1 text-xs text-on-surface/60">
            Se enviar arquivo, ele substituirá a imagem atual.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 items-end">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select name="status" defaultValue={establishment.status} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="has_ifood" defaultChecked={establishment.has_ifood} className="rounded border-outline" />
            Possui iFood
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" defaultChecked={establishment.is_featured} className="rounded border-outline" />
            Destaque na home
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_indicated" defaultChecked={establishment.is_indicated} className="rounded border-outline" />
            Indicação
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar alterações
          </button>
          <Link href="/admin/estabelecimentos" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
