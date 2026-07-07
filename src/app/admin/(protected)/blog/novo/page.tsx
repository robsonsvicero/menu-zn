import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createBlogPostAction, updateBlogPostStatusAction } from "../actions";
import { BlogContentEditor } from "../blog-content-editor";
import { BlogSlugGenerator } from "../blog-slug-generator";
import { ImagePreviewInput } from "../image-preview-input";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

type OptionRow = { id: string; name: string };
type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  cover_image_url: string | null;
  blog_categories: { name: string }[] | null;
};

export default async function NovoBlogPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  
  // Buscar categorias, autores e posts cadastrados para a listagem na mesma página
  const [{ data: categories }, { data: authorsData }, { data: postsData }] = await Promise.all([
    supabase.from("blog_categories").select("id, name").order("name"),
    supabase.from("authors").select("id, name").order("name"),
    supabase.from("blog_posts").select("id, title, slug, status, published_at, cover_image_url, blog_categories(name)").order("created_at", { ascending: false }).limit(20)
  ]);

  const categoryOptions = (categories ?? []) as OptionRow[];
  const authorOptions = (authorsData ?? []) as OptionRow[];
  const posts = (postsData ?? []) as BlogPostRow[];

  return (
    <section className="max-w-[900px] mx-auto bg-white p-6 md:p-10 rounded-3xl mb-10">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-serif text-on-surface font-bold">Blog</h2>
        <Link href="/admin/blog" className="rounded-full border border-outline/30 px-6 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-[#faf8f5] transition">
          Limpar
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#fff0f0] border border-[#ffc2c2] text-[#d62d2d] text-sm">
          <strong>Erro ao salvar:</strong> {error}
        </div>
      )}

      <form action={createBlogPostAction} className="space-y-10">
        {/* INFORMAÇÕES */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Informações</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Novo Artigo</h3>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Título do post *</label>
              <input name="title" placeholder="Como criar uma marca memorável" required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Slug *</label>
              <input name="slug" placeholder="como-criar-marca-memoravel" required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Autor *</label>
              <select name="author_id" required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition">
                <option value="">Selecione um autor</option>
                {authorOptions.map((author) => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Categoria *</label>
              <select name="category_id" required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition">
                <option value="">Selecione uma categoria</option>
                {categoryOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Data de publicação</label>
              <input type="date" name="published_at" className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Tags</label>
              <input placeholder="percepção, posicionamento, confiança" className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
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
            <textarea name="excerpt" placeholder="Uma síntese para SEO e chamadas." rows={2} className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition resize-none" />
          </div>

          <div>
            <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Conteúdo do artigo</label>
            <BlogContentEditor />
          </div>
        </div>

        {/* MÍDIA */}
        <div className="space-y-6 pt-2">
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Mídia</p>
            <h3 className="font-serif text-lg font-bold text-on-surface">Imagem de Destaque</h3>
          </div>

          <ImagePreviewInput name="image_file" />
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
                <input type="checkbox" name="status" value="published" defaultChecked className="peer sr-only" />
                <div className="w-10 h-6 bg-outline/30 rounded-full peer peer-checked:bg-primary transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
              </div>
            </label>

            <button type="submit" className="rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
              Publicar Artigo
            </button>
          </div>
        </div>
      </form>
      <BlogSlugGenerator />

      {/* LISTA DE ARTIGOS CADASTRADOS */}
      <div className="mt-16 pt-10 border-t border-outline/10">
        <h3 className="text-sm font-bold text-on-surface mb-6">Artigos Cadastrados ({posts.length})</h3>
        
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b border-outline/5 last:border-0">
              <div className="flex items-center gap-4">
                {post.cover_image_url ? (
                  <div className="w-16 h-12 rounded-lg bg-outline/10 overflow-hidden relative shrink-0">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-[#faf8f5] flex items-center justify-center shrink-0">
                    <ImageIcon size={16} className="text-outline" />
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-on-surface">{post.title}</h4>
                  <p className="text-[10px] text-on-surface/50 mt-1">Robson Svicero • {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "Rascunho"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {post.status === "published" && (
                  <span className="px-3 py-1 bg-[#e8f8ec] text-[#2c9f45] rounded-full text-[10px] font-bold uppercase tracking-wider mr-2">
                    Publicado
                  </span>
                )}
                {post.status === "draft" && (
                  <span className="px-3 py-1 bg-[#f8f0e8] text-[#9f6a2c] rounded-full text-[10px] font-bold uppercase tracking-wider mr-2">
                    Rascunho
                  </span>
                )}
                
                <Link href={`/admin/blog/${post.id}/editar`} className="rounded-full border border-outline/30 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-on-surface hover:bg-[#faf8f5] transition">
                  Editar
                </Link>
                
                <form action={updateBlogPostStatusAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="next_status" value="archived" />
                  <button type="submit" className="rounded-full bg-primary px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
          
          {posts.length === 0 && (
            <p className="text-sm text-on-surface/50 italic py-4">Nenhum artigo cadastrado.</p>
          )}
        </div>
      </div>
    </section>
  );
}
