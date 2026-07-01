import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateTestimonialAction } from "../../actions";
import { DeleteTestimonialButton } from "../../DeleteTestimonialButton";

export const dynamic = "force-dynamic";

type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
  source: string | null;
  blog_post_id: string | null;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
};

export default async function EditarDepoimentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: item }, { data: posts }] = await Promise.all([
    supabase
      .from("testimonials")
      .select("id, author_name, author_role, author_avatar_url, content, rating, source, blog_post_id, status, is_featured")
      .eq("id", id)
      .single(),
    supabase
      .from("blog_posts")
      .select("id, title")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(100),
  ]);

  if (!item) {
    notFound();
  }

  const testimonial = item as Testimonial;

  return (
    <section className="max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-3xl font-serif">Editar depoimento</h2>
        <DeleteTestimonialButton
          id={testimonial.id}
          authorName={testimonial.author_name}
          redirectAfterDelete
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        />
        <p className="text-sm text-on-surface/70 mt-1">Atualize conteúdo, nota, status e destaque.</p>
      </div>

      <form action={updateTestimonialAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <input type="hidden" name="id" value={testimonial.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Nome do autor *</label>
            <input name="author_name" required defaultValue={testimonial.author_name} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Cargo / relação</label>
            <input name="author_role" defaultValue={testimonial.author_role ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Avatar URL</label>
            <input name="author_avatar_url" defaultValue={testimonial.author_avatar_url ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Nota (1 a 5)</label>
            <input name="rating" type="number" min="1" max="5" defaultValue={testimonial.rating ?? undefined} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Conteúdo *</label>
          <textarea name="content" rows={6} required defaultValue={testimonial.content} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Fonte</label>
            <input name="source" defaultValue={testimonial.source ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select name="status" defaultValue={testimonial.status} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Artigo relacionado</label>
          <select name="blog_post_id" defaultValue={testimonial.blog_post_id ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
            <option value="">Sem artigo relacionado</option>
            {(posts ?? []).map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_featured" defaultChecked={testimonial.is_featured} className="rounded border-outline" />
          Destaque na home
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar alterações
          </button>
          <Link href="/admin/depoimentos" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
