import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Share2, Bookmark, Heart, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { fetchPublishedBlogPostBySlug, fetchPublishedBlogPosts } from "@/lib/blog-public";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function estimateReadTime(content: string | null) {
  const words = content?.split(/\s+/).filter(Boolean).length ?? 0;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min de leitura`;
}

function renderContent(content: string | null) {
  if (!content) {
    return null;
  }

  const blocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith("### ")) {
      return (
        <h3 key={index} className="mt-10 font-serif text-2xl text-[rgb(148_53_21)]">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }

    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="mt-12 font-serif text-3xl text-on-surface">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (block.startsWith("# ")) {
      return (
        <h1 key={index} className="mt-12 font-serif text-4xl text-on-surface">
          {block.replace(/^#\s+/, "")}
        </h1>
      );
    }

    if (/^[-*]\s+/m.test(block)) {
      const lines = block.split("\n").filter(Boolean);
      return (
        <ul key={index} className="mt-6 list-disc space-y-2 pl-6 text-[17px] leading-8 text-on-surface/90">
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{line.replace(/^[-*]\s+/, "")}</li>
          ))}
        </ul>
      );
    }

    if (/^>\s+/.test(block)) {
      return (
        <blockquote key={index} className="my-10 rounded-3xl border-l-4 border-[rgb(148_53_21)] bg-[#faf3ee] p-8 font-serif text-xl italic leading-9 text-on-surface">
          {block.replace(/^>\s+/gm, "")}
        </blockquote>
      );
    }

    return (
      <p key={index} className="text-[17px] leading-8 text-on-surface/90 whitespace-pre-line">
        {block}
      </p>
    );
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Matéria não encontrada | Menu ZN",
    };
  }

  return {
    title: `${post.seo_title ?? post.title} | Menu ZN`,
    description: post.seo_description ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostDetail({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await fetchPublishedBlogPosts({ limit: 4 }))
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const categoryName = Array.isArray(post.blog_categories)
    ? post.blog_categories[0]?.name
    : (post.blog_categories as any)?.name;

  return (
    <main className="min-h-screen bg-white text-on-surface">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.cover_image_url ?? "/images/hero-blog-destaque.png"}
            alt={post.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        <div className="relative mx-auto flex min-h-155 max-w-300 items-end px-6 py-16 md:px-10 lg:px-12">
          <div className="max-w-4xl pb-4 text-white">
            {categoryName ? (
              <span className="inline-flex rounded-full bg-[rgb(148_53_21)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-sm mb-4">
                {categoryName}
              </span>
            ) : null}

            <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
              {post.authors ? (
                <div className="flex items-center gap-2">
                  {post.authors.avatar_url ? (
                    <img src={post.authors.avatar_url} alt={post.authors.name} className="w-6 h-6 rounded-full object-cover border border-white/20" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                      {post.authors.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>Por {post.authors.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                    M
                  </div>
                  <span>Por Equipe Menu ZN</span>
                </div>
              )}
              
              <span className="opacity-50">•</span>
              <span>{formatDate(post.published_at)}</span>
              <span className="opacity-50">•</span>
              <span>{estimateReadTime(post.content_md)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-245 px-6 py-14 md:px-10 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[72px_1fr] lg:grid-cols-[88px_1fr]">
          <aside className="hidden md:flex flex-col gap-3 sticky top-28 h-fit pt-2">
            <button className="w-11 h-11 rounded-full border border-outline flex items-center justify-center text-on-surface transition hover:border-[rgb(148_53_21)] hover:text-[rgb(148_53_21)]" title="Compartilhar">
              <Share2 size={16} strokeWidth={1.5} />
            </button>
            <button className="w-11 h-11 rounded-full border border-outline flex items-center justify-center text-on-surface transition hover:border-[rgb(148_53_21)] hover:text-[rgb(148_53_21)]" title="Salvar artigo">
              <Bookmark size={16} strokeWidth={1.5} />
            </button>
            <button className="w-11 h-11 rounded-full border border-outline flex items-center justify-center text-on-surface transition hover:border-[rgb(148_53_21)] hover:text-[rgb(148_53_21)]" title="Curtir">
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </aside>

          <div>
            <article className="space-y-6">
              {renderContent(post.content_md) ?? (
                <p className="text-[17px] leading-8 text-on-surface/90 whitespace-pre-line">
                  {post.excerpt ?? "Conteúdo em atualização."}
                </p>
              )}
            </article>

            <div className="mt-16 rounded-[28px] border border-outline/20 bg-[#faf8f5] p-8 md:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {post.authors?.avatar_url ? (
                  <img src={post.authors.avatar_url} alt={post.authors.name} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(148_53_21)] text-white font-serif text-2xl">
                    {post.authors?.name ? post.authors.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                )}
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-on-surface/55">Publicado por</p>
                  <h2 className="mt-1 font-serif text-2xl">{post.authors?.name ?? "Equipe Menu ZN"}</h2>
                  <p className="mt-2 text-sm leading-7 text-on-surface/70">
                    {post.authors?.role ?? "Conteúdo editorial publicado pelo painel administrativo, agora alimentando o front público diretamente do Supabase."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 ? (
        <section className="bg-[#f6f2eb] py-16 md:py-20">
          <div className="mx-auto max-w-300 px-6 md:px-10 lg:px-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl">Continue explorando</h2>
                <p className="mt-1 text-sm text-on-surface/65">Matérias recentes publicadas no blog.</p>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[rgb(148_53_21)]">
                Ver todas
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((item) => {
                const itemCategory = Array.isArray(item.blog_categories)
                  ? item.blog_categories[0]?.name
                  : (item.blog_categories as any)?.name;

                return (
                  <Link key={item.id} href={`/blog/${item.slug}`} className="group overflow-hidden rounded-[26px] border border-outline/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={item.cover_image_url ?? "/images/hero-blog-destaque.png"}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-3 p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[rgb(148_53_21)]">
                        {itemCategory ?? "Artigo"}
                      </p>
                      <h3 className="font-serif text-xl leading-snug text-on-surface transition group-hover:text-[rgb(148_53_21)]">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-7 text-on-surface/70 line-clamp-3">
                        {item.excerpt ?? "Conteúdo editorial do Menu ZN."}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
