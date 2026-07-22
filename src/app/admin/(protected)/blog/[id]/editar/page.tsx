import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createBlogPreviewToken } from "@/lib/blog-preview-token";
import { updateBlogPostAction } from "../../actions";
import { BlogContentEditor } from "../../blog-content-editor";
import { ImagePreviewInput } from "../../image-preview-input";

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
  blog_categories: { name: string }[] | { name: string } | null;
  author_id: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published" | "archived";
};

export default async function EditarBlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: post }, { data: categories }, { data: authorsData }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, content_md, cover_image_url, category_id, blog_categories(name), author_id, published_at, seo_title, seo_description, status")
      .eq("id", id)
      .single(),
    supabase.from("blog_categories").select("id, name").order("name"),
    supabase.from("authors").select("id, name").order("name"),
  ]);

  if (!post) {
    notFound();
  }

  const blogPost = post as BlogPost;
  const categoryOptions = (categories ?? []) as OptionRow[];
  const authorOptions = (authorsData ?? []) as OptionRow[];
  const previewToken = createBlogPreviewToken(blogPost.slug);
  const previewHref =
    blogPost.status === "published"
      ? `/blog/${blogPost.slug}`
      : previewToken
        ? `/blog/${blogPost.slug}?preview=${encodeURIComponent(previewToken)}`
        : `/blog/${blogPost.slug}?preview=1`;

  return (
    <section className="max-w-[900px] mx-auto bg-white p-6 md:p-10 rounded-3xl mb-10">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-serif text-on-surface font-bold">Blog</h2>
        <div className="flex items-center gap-2">
          <Link
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-outline/30 px-6 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-[#faf8f5] transition"
          >
            Visualizar
          </Link>
          <Link href="/admin/blog" className="rounded-full border border-outline/30 px-6 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-[#faf8f5] transition">
            Voltar
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#fff0f0] border border-[#ffc2c2] text-[#d62d2d] text-sm">
          <strong>Erro ao salvar:</strong> {error}
        </div>
      )}

      <form action={updateBlogPostAction} className="space-y-10">
        <input type="hidden" name="id" value={blogPost.id} />
        <input type="hidden" name="current_cover_image_url" value={blogPost.cover_image_url ?? ""} />

        {/* INFORMAÇÕES */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Informações</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Editar Artigo</h3>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Título do post *</label>
              <input name="title" defaultValue={blogPost.title} required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Slug *</label>
              <input name="slug" defaultValue={blogPost.slug} required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Autor *</label>
              <select name="author_id" defaultValue={blogPost.author_id ?? ""} required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition">
                <option value="">Selecione um autor</option>
                {authorOptions.map((author) => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Categoria</label>
              <select name="category_id" defaultValue={blogPost.category_id ?? ""} required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition">
                <option value="">Selecione uma categoria</option>
                {categoryOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Data de publicação</label>
              <input
                type="date"
                name="published_at"
                defaultValue={blogPost.published_at ? blogPost.published_at.substring(0, 10) : ""}
                className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Conteúdo</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Corpo do Artigo</h3>
          </div>

          <div>
            <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Resumo</label>
            <textarea name="excerpt" defaultValue={blogPost.excerpt ?? ""} rows={2} className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition resize-none" />
          </div>

          <div>
            <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Conteúdo do artigo</label>
            <BlogContentEditor defaultValue={blogPost.content_md ?? ""} />
          </div>
        </div>

        {/* MÍDIA */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Mídia</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Imagem de Destaque</h3>
          </div>

          <ImagePreviewInput name="image_file" defaultImageUrl={blogPost.cover_image_url ?? ""} />
        </div>

        {/* SEO */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">SEO</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Otimização</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">SEO Title</label>
              <input name="seo_title" defaultValue={blogPost.seo_title ?? ""} className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">SEO Description</label>
              <input name="seo_description" defaultValue={blogPost.seo_description ?? ""} className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
          </div>
        </div>

        {/* PUBLICAÇÃO */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Publicação</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Opções de Publicação</h3>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <label className="flex flex-1 items-center justify-between md:justify-start gap-4 rounded-2xl bg-[#faf8f5] px-6 py-4 cursor-pointer">
              <span className="text-sm text-on-surface font-medium">Publicar artigo imediatamente</span>
              <div className="relative inline-block w-10 h-6">
                <input type="checkbox" name="status" value="published" defaultChecked={blogPost.status === "published"} className="peer sr-only" />
                <div className="w-10 h-6 bg-outline/30 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
              </div>
            </label>

            <button type="submit" className="rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
              Salvar Alterações
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
