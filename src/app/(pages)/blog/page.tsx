import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight, Search } from "lucide-react";
import { fetchBlogCategoryOptions, fetchPublishedBlogPosts } from "@/lib/blog-public";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function buildQueryString(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "/blog";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const category = (params.category ?? "").trim();
  const sort = params.sort === "oldest" ? "oldest" : "recent";

  const [posts, categories] = await Promise.all([
    fetchPublishedBlogPosts({ search: query, category, limit: 40 }),
    fetchBlogCategoryOptions(),
  ]);

  const orderedPosts = sort === "oldest" ? [...posts].reverse() : posts;
  const featuredPost = orderedPosts[0] ?? null;
  const listPosts = featuredPost ? orderedPosts.slice(1) : orderedPosts;
  const fallbackImage = "/images/hero-blog-destaque.png";

  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface">
      <section className="relative overflow-hidden border-b border-outline/30">
        <div className="absolute inset-0">
          <Image
            src={featuredPost?.cover_image_url ?? fallbackImage}
            alt={featuredPost?.title ?? "Blog Menu ZN"}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-black/30" />
        </div>

        <div className="relative mx-auto flex min-h-160 max-w-300 items-end px-6 py-20 md:px-10 lg:px-12">
          <div className="max-w-3xl pb-4 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
              Blog Menu ZN
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              {featuredPost?.title ?? "Histórias, guias e descobertas da Zona Norte"}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
              {featuredPost?.excerpt ?? "Acompanhe nossas matérias, guias e bastidores da gastronomia da Zona Norte com conteúdo publicado direto do painel administrativo."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/85">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <CalendarDays size={16} />
                {formatDate(featuredPost?.published_at ?? null)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                Por Equipe Menu ZN
              </span>
              {featuredPost?.blog_categories?.[0]?.name ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  {featuredPost.blog_categories[0].name}
                </span>
              ) : null}
            </div>

            {featuredPost ? (
              <div className="mt-10">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[rgb(148_53_21)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
                >
                  Ler matéria completa
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-b border-outline/20 bg-[#faf8f5]/90 backdrop-blur-md">
        <div className="mx-auto max-w-300 px-6 py-5 md:px-10 lg:px-12">
          <form method="get" className="grid gap-3 rounded-3xl border border-outline/40 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_auto]">
            <label className="relative block">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/45" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Buscar por título, resumo ou slug"
                className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
              />
            </label>

            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
            >
              <option value="">Todas as categorias</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
            </select>

            <div className="flex gap-2">
              <button type="submit" className="rounded-2xl bg-[rgb(148_53_21)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90">
                Filtrar
              </button>
              <Link href="/blog" className="rounded-2xl border border-outline/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-surface transition hover:bg-[#f3efe8]">
                Limpar
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-6 py-14 md:px-10 lg:px-12 lg:py-18">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Últimas publicações</h2>
            <p className="mt-1 text-sm text-on-surface/65">
              {orderedPosts.length} artigo{orderedPosts.length === 1 ? "" : "s"} publicado{orderedPosts.length === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 5).map((item) => (
              <Link
                key={item.slug}
                href={buildQueryString({ q: query || undefined, category: item.slug, sort })}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${category === item.slug ? "border-[rgb(148_53_21)] bg-[rgb(148_53_21)] text-white" : "border-outline/50 bg-white text-on-surface hover:bg-[#f3efe8]"}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {orderedPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[28px] border border-outline/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={post.cover_image_url ?? fallbackImage}
                    alt={post.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-transparent" />
                  {post.blog_categories?.[0]?.name ? (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(148_53_21)]">
                      {post.blog_categories[0].name}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.16em] text-on-surface/55">
                    <span>{formatDate(post.published_at)}</span>
                    <span>Equipe Menu ZN</span>
                  </div>

                  <h3 className="font-serif text-2xl leading-tight text-on-surface transition group-hover:text-[rgb(148_53_21)]">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-7 text-on-surface/70">
                    {post.excerpt ?? "Conteúdo publicado pelo time editorial do Menu ZN."}
                  </p>

                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[rgb(148_53_21)]">
                    Ler matéria
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-outline/30 bg-white p-10 text-center shadow-sm">
            <h3 className="font-serif text-2xl text-on-surface">Nenhuma publicação encontrada</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface/65">
              Ajuste a busca ou selecione outra categoria para encontrar matérias publicadas.
            </p>
            <div className="mt-6">
              <Link href="/blog" className="rounded-full bg-[rgb(148_53_21)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90">
                Ver tudo
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
