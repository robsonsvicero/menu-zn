import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateBlogPostStatusAction } from "./actions";

export const dynamic = "force-dynamic";

type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  blog_categories: any;
};

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, blog_categories(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const posts = (data ?? []) as BlogPostRow[];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif">Blog</h2>
          <p className="text-sm text-on-surface/70 mt-1">Posts editoriais conectados ao Supabase.</p>
        </div>

        <Link href="/admin/blog/novo" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          + Novo post
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar posts: {error.message}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Título</th>
              <th className="px-4 py-3 text-left font-medium">Categoria</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Publicação</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-outline/60">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">
                  {Array.isArray(post.blog_categories)
                    ? post.blog_categories[0]?.name ?? "-"
                    : post.blog_categories?.name ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs uppercase tracking-wide">
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface/70">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "-"}
                </td>
                <td className="px-4 py-3 text-on-surface/70">{post.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/blog/${post.id}/editar`}
                      className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background"
                    >
                      Editar
                    </Link>

                    {post.status !== "published" ? (
                      <form action={updateBlogPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="next_status" value="published" />
                        <button type="submit" className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                          Publicar
                        </button>
                      </form>
                    ) : null}

                    {post.status !== "archived" ? (
                      <form action={updateBlogPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="next_status" value="archived" />
                        <button type="submit" className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                          Arquivar
                        </button>
                      </form>
                    ) : null}

                    {post.status !== "draft" ? (
                      <form action={updateBlogPostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="next_status" value="draft" />
                        <button type="submit" className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                          Rascunho
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-on-surface/70">
                  Nenhum post cadastrado ainda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-on-surface/60">Próxima entrega: criação/edição de posts com conteúdo e SEO.</p>
    </section>
  );
}
