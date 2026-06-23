import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createBlogPostAction } from "../actions";

export const dynamic = "force-dynamic";

type OptionRow = { id: string; name: string };

export default async function NovoBlogPostPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("blog_categories").select("id, name").order("name");
  const categoryOptions = (categories ?? []) as OptionRow[];

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif">Novo post</h2>
        <p className="text-sm text-on-surface/70 mt-1">Crie artigos, guias e matérias editoriais do Menu ZN.</p>
      </div>

      <form action={createBlogPostAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Título *</label>
            <input name="title" required className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug (opcional)</label>
            <input name="slug" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" placeholder="gerado-automaticamente" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Categoria</label>
            <select name="category_id" className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="">Sem categoria</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select name="status" defaultValue="draft" className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Resumo</label>
          <textarea name="excerpt" rows={3} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm mb-1">Conteúdo em Markdown</label>
          <textarea name="content_md" rows={10} className="w-full rounded-xl border border-outline px-3 py-2 text-sm font-mono" />
        </div>

        <div>
          <label className="block text-sm mb-1">Upload da imagem de capa</label>
          <input
            type="file"
            name="image_file"
            accept="image/*"
            className="w-full rounded-xl border border-outline px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-1.5"
          />
          <p className="mt-1 text-xs text-on-surface/60">Se enviar arquivo, ele será usado como imagem principal do post.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">SEO Title</label>
            <input name="seo_title" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">SEO Description</label>
            <input name="seo_description" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar post
          </button>
          <Link href="/admin/blog" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
