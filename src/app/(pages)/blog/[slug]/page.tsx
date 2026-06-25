import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
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

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "u"],
};

function renderContent(content: string | null) {
  if (!content) {
    return null;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, markdownSanitizeSchema]]}
      components={{
        h1: ({ children }) => <h1 className="mt-12 font-serif text-4xl text-on-surface">{children}</h1>,
        h2: ({ children }) => <h2 className="mt-12 font-serif text-3xl text-on-surface">{children}</h2>,
        h3: ({ children }) => <h3 className="mt-10 font-serif text-2xl text-[rgb(148_53_21)]">{children}</h3>,
        p: ({ children }) => <p className="text-[17px] leading-8 text-on-surface/90">{children}</p>,
        ul: ({ children }) => <ul className="mt-6 list-disc space-y-2 pl-6 text-[17px] leading-8 text-on-surface/90">{children}</ul>,
        ol: ({ children }) => <ol className="mt-6 list-decimal space-y-2 pl-6 text-[17px] leading-8 text-on-surface/90">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="my-10 rounded-3xl border-l-4 border-[rgb(148_53_21)] bg-[#faf3ee] p-8 font-serif text-xl italic leading-9 text-on-surface">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="font-semibold text-[rgb(148_53_21)] underline decoration-[rgb(148_53_21)]/40 underline-offset-2 transition hover:decoration-[rgb(148_53_21)]"
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-bold text-on-surface">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        u: ({ children }) => <u className="underline decoration-1 underline-offset-3">{children}</u>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Matéria não encontrada | Menu Zona Norte",
    };
  }

  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? undefined;
  const imageUrl = post.cover_image_url ?? "/images/hero-blog-destaque.jpeg";
  const canonical = `https://www.menuzonanorte.com.br/blog/${post.slug}`;
  const authorName =
    typeof post.authors === "object" && post.authors !== null && "name" in post.authors
      ? (post.authors as { name: string }).name
      : "Equipe Menu Zona Norte";

  return {
    title: `${title} | Menu Zona Norte`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: `${title} | Menu Zona Norte`,
      description,
      url: canonical,
      siteName: "Menu Zona Norte",
      locale: "pt_BR",
      publishedTime: post.published_at ?? undefined,
      authors: [authorName],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Menu Zona Norte`,
      description,
      images: [imageUrl],
    },
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

  const postAuthorName =
    typeof post.authors === "object" && post.authors !== null && "name" in post.authors
      ? (post.authors as { name: string }).name
      : "Equipe Menu Zona Norte";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    image: post.cover_image_url ?? "https://www.menuzonanorte.com.br/images/hero-blog-destaque.jpeg",
    datePublished: post.published_at ?? undefined,
    author: {
      "@type": "Person",
      name: postAuthorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Menu Zona Norte",
      url: "https://www.menuzonanorte.com.br",
    },
    url: `https://www.menuzonanorte.com.br/blog/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.menuzonanorte.com.br/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <div className="mx-auto max-w-4xl">
          {/* <aside className="hidden md:flex flex-col gap-3 sticky top-28 h-fit pt-2">
            <button className="w-11 h-11 rounded-full border border-outline flex items-center justify-center text-on-surface transition hover:border-[rgb(148_53_21)] hover:text-[rgb(148_53_21)]" title="Compartilhar">
              <Share2 size={16} strokeWidth={1.5} />
            </button>
            <button className="w-11 h-11 rounded-full border border-outline flex items-center justify-center text-on-surface transition hover:border-[rgb(148_53_21)] hover:text-[rgb(148_53_21)]" title="Salvar artigo">
              <Bookmark size={16} strokeWidth={1.5} />
            </button>
            <button className="w-11 h-11 rounded-full border border-outline flex items-center justify-center text-on-surface transition hover:border-[rgb(148_53_21)] hover:text-[rgb(148_53_21)]" title="Curtir">
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </aside> */}

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
    </>
  );
}
