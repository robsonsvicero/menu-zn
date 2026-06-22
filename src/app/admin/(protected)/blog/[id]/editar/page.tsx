import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBlogPostAction } from "../../actions";

export const dynamic = "force-dynamic";

type OptionRow = { id: string; name: string };

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published" | "archived";
};

export default async function EditarBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content_md, cover_image_url, category_id, seo_title, seo_description, status")
      .eq("id", id)
      .single(),
    supabase.from("blog_categories").select("id, name").order("name"),
  ]);

  if (!post) {
    notFound();
  }

  const blogPost = post as BlogPost;
  const categoryOptions = (categories ?? []) as OptionRow[];

  return (
    <section className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-serif">Editar post</h2>
        <p className="text-sm text-on-surface/70 mt-1">Atualize título, conteúdo, SEO e status.</p>
      </div>

      <form action={updateBlogPostAction} className="rounded-2xl border border-outline bg-white p-6 md:p-8 space-y-5">
        <input type="hidden" name="id" value={blogPost.id} />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Título *</label>
            <input name="title" required defaultValue={blogPost.title} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input name="slug" defaultValue={blogPost.slug} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">Categoria</label>
            <select name="category_id" defaultValue={blogPost.category_id ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="">Sem categoria</option>
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select name="status" defaultValue={blogPost.status} className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Resumo</label>
          <textarea name="excerpt" rows={3} defaultValue={blogPost.excerpt ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm mb-1">Conteúdo em Markdown</label>
          <textarea name="content_md" rows={10} defaultValue={blogPost.content_md ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm font-mono" />
        </div>

        <div>
          <label className="block text-sm mb-1">URL da imagem de capa</label>
          <input name="cover_image_url" defaultValue={blogPost.cover_image_url ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm mb-1">SEO Title</label>
            <input name="seo_title" defaultValue={blogPost.seo_title ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm mb-1">SEO Description</label>
            <input name="seo_description" defaultValue={blogPost.seo_description ?? ""} className="w-full rounded-xl border border-outline px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
            Salvar alterações
          </button>
          <Link href="/admin/blog" className="rounded-xl border border-outline px-5 py-2.5 text-sm hover:bg-background">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
