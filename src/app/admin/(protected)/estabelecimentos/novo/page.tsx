import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createEstablishmentAction } from "../actions";

export const dynamic = "force-dynamic";

type OptionRow = { id: string; name: string };

export default async function NovoEstabelecimentoPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: neighborhoods }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("neighborhoods").select("id, name").order("name"),
  ]);

  const categoryOptions = (categories ?? []) as OptionRow[];
  const neighborhoodOptions = (neighborhoods ?? []) as OptionRow[];

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif">Novo estabelecimento</h2>
        <p className="text-sm text-on-surface/70 mt-1">Cadastre restaurante, bar, pizzaria, padaria e outros locais.</p>
      </div>

      <form action={createEstablishmentAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome *</label>
            <input name="name" required className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug (opcional)</label>
            <input name="slug" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" placeholder="gerado-automaticamente" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Categoria *</label>
            <select name="category_id" required className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="">Selecione...</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Bairro</label>
            <select name="neighborhood_id" className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="">Selecione...</option>
              {neighborhoodOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Resumo</label>
          <input name="short_description" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm mb-1">Descrição</label>
          <textarea name="description" rows={4} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Endereço</label>
            <input name="address" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <input name="phone" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm mb-1">WhatsApp</label>
            <input name="whatsapp" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input name="website_url" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Instagram</label>
            <input name="instagram_url" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">URL da imagem de capa</label>
          <input name="image_cover_url" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
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
            Se enviar arquivo, ele terá prioridade sobre a URL de imagem.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 items-end">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select name="status" defaultValue="draft" className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="has_ifood" className="rounded border-outline" />
            Possui iFood
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" className="rounded border-outline" />
            Destaque na home
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_indicated" className="rounded border-outline" />
            Indicação
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar estabelecimento
          </button>
          <Link href="/admin/estabelecimentos" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
