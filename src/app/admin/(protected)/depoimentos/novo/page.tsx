import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createTestimonialAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NovoDepoimentoPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(100);

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif">Novo depoimento</h2>
        <p className="text-sm text-on-surface/70 mt-1">Cadastre avaliações e opiniões para moderação no site.</p>
      </div>

      <form action={createTestimonialAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome do autor *</label>
            <input name="author_name" required className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cargo / relação</label>
            <input name="author_role" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Avatar URL</label>
            <input name="author_avatar_url" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Nota (1 a 5)</label>
            <input name="rating" type="number" min="1" max="5" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Conteúdo *</label>
          <textarea name="content" rows={6} required className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Fonte</label>
            <input name="source" className="w-full rounded-xl border border-outline px-3 py-2 text-sm" placeholder="Google, Instagram, Depoimento interno..." />
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select name="status" defaultValue="pending" className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Artigo relacionado</label>
          <select name="blog_post_id" defaultValue="" className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
            <option value="">Sem artigo relacionado</option>
            {(posts ?? []).map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_featured" className="rounded border-outline" />
          Destaque na home
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar depoimento
          </button>
          <Link href="/admin/depoimentos" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
