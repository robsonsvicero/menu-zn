import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Eye } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { createClient } from "@/lib/supabase/server";
import { verifyBlogPreviewToken } from "@/lib/blog-preview-token";
import { formatViewCount } from "@/lib/blog-format";
import { sanitizeStyleAttribute } from "@/lib/html-style-sanitize";
import {
  fetchApprovedBlogTestimonials,
  fetchBlogPostBySlugForAdminPreview,
  fetchPublishedBlogPostBySlug,
  fetchPublishedBlogPosts,
  type BlogCategoryRelation,
} from "@/lib/blog-public";
import { BlogTestimonialForm } from "./BlogTestimonialForm";
import { BlogViewTracker } from "./BlogViewTracker";
import { BlogShareBar } from "./BlogShareBar";
import { AdCarousel } from "./AdCarousel";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);

async function canPreviewUnpublishedPost() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: roleRows, error } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  if (error) {
    return false;
  }

  const roleCodes = (roleRows ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  return roleCodes.some((code) => allowedAdminRoles.has(code));
}

async function fetchBlogPostForRequest(slug: string, previewMode: boolean) {
  if (!previewMode) {
    return fetchPublishedBlogPostBySlug(slug);
  }

  const hasAccess = await canPreviewUnpublishedPost();

  if (!hasAccess) {
    return null;
  }

  return fetchBlogPostBySlugForAdminPreview(slug);
}

async function fetchBlogPostForPreviewQuery(slug: string, previewQueryValue: string | undefined) {
  const previewValue = previewQueryValue?.trim();

  if (!previewValue) {
    return {
      post: await fetchPublishedBlogPostBySlug(slug),
      isPreview: false,
    };
  }

  if (previewValue === "1") {
    return {
      post: await fetchBlogPostForRequest(slug, true),
      isPreview: true,
    };
  }

  const isValidPreviewToken = verifyBlogPreviewToken(previewValue, slug);

  if (!isValidPreviewToken) {
    return {
      post: await fetchPublishedBlogPostBySlug(slug),
      isPreview: false,
    };
  }

  return {
    post: await fetchBlogPostBySlugForAdminPreview(slug),
    isPreview: true,
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function estimateReadTime(content: string | null) {
  const words = content?.split(/\s+/).filter(Boolean).length ?? 0;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min de leitura`;
}

function getCategoryName(value: BlogCategoryRelation) {
  return Array.isArray(value) ? value[0]?.name : value?.name;
}

function getInstagramHandle(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("@")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const handle = url.pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : null;
  } catch {
    const handle = trimmed.replace(/^\/+|\/+$/g, "");
    return handle ? `@${handle}` : null;
  }
}

const markdownSanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "mark", "span", "u"],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "style"],
  },
};

type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
};

function sanitizeInlineStyles() {
  return function transformer(tree: HastNode) {
    function visit(node: HastNode) {
      const properties = node.properties;
      const style = properties?.style;

      if (properties && typeof style === "string") {
        const sanitizedStyle = sanitizeStyleAttribute(style);

        if (sanitizedStyle) {
          properties.style = sanitizedStyle;
        } else {
          delete properties.style;
        }
      }

      node.children?.forEach(visit);
    }

    visit(tree);
  };
}

function renderContent(content: string | null) {
  if (!content) {
    return null;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, sanitizeInlineStyles, [rehypeSanitize, markdownSanitizeSchema]]}
      components={{
        a: ({ href, children, ...props }) => (
          <a {...props} href={href} target="_blank" rel="noreferrer">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { post } = await fetchBlogPostForPreviewQuery(slug, preview);

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


export default async function BlogPostDetail({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const { post, isPreview } = await fetchBlogPostForPreviewQuery(slug, preview);

  if (!post) {
    notFound();
  }

  const supabase = await createClient();
  const [allRelatedPosts, testimonials, advertisementResult] = await Promise.all([
    fetchPublishedBlogPosts({ limit: 4 }),
    fetchApprovedBlogTestimonials(post.id),
    supabase
      .from("blog_advertisements")
      .select("id, title, image_url, target_url")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(30),
  ]);

  if (advertisementResult.error) {
    throw new Error(`Não foi possível carregar os anúncios do blog: ${advertisementResult.error.message}`);
  }

  const advertisements = advertisementResult.data ?? [];
  const relatedPosts = allRelatedPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const categoryName = getCategoryName(post.blog_categories);
  const authorInstagramHandle = getInstagramHandle(post.authors?.instagram_url);

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
      <main className="min-h-screen bg-[#faf8f2] text-on-surface">
      <section className="mx-auto max-w-[1680px] px-6 pb-8 pt-6 md:pb-10 md:pt-8">
        <AdCarousel advertisements={advertisements} placement="hero" />

        <div className="mx-auto max-w-200 flex flex-col items-center justify-center text-center">
          {categoryName ? (
            <span className="mx-auto mb-8 flex w-fit rounded-full bg-[rgb(148_53_21)] px-3 py-1.5 text-[10px] font-normal uppercase tracking-[0.12em] text-white lg:text-xs">
              {categoryName}
            </span>
          ) : null}

          <nav aria-label="Breadcrumb" className="mb-5 w-full min-w-0 text-xs text-on-surface/60 sm:text-sm">
            <ol className="flex w-full min-w-0 items-center gap-2">
              <li className="shrink-0">
                <Link href="/" className="transition-colors hover:text-[rgb(148_53_21)]">Início</Link>
              </li>
              <li aria-hidden="true" className="shrink-0 text-on-surface/35">/</li>
              <li className="shrink-0">
                <Link href="/blog" className="transition-colors hover:text-[rgb(148_53_21)]">Blog</Link>
              </li>
              <li aria-hidden="true" className="shrink-0 text-on-surface/35">/</li>
              <li aria-current="page" className="min-w-0 flex-1 truncate text-left">{post.title}</li>
            </ol>
          </nav>

          <h1 className="mb-12 max-w-190 font-serif text-4xl leading-[1.12] text-on-surface md:text-6xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-on-surface/65 lg:text-sm">
              {post.authors ? (
                <div className="flex items-center gap-2">
                  {post.authors.avatar_url ? (
                    <Image
                      src={post.authors.avatar_url}
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                      className="h-7 w-7 rounded-full border border-on-surface/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(148_53_21)] text-xs font-bold text-white">
                      {post.authors.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>Por {post.authors.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgb(148_53_21)] text-xs font-bold text-white">
                    M
                  </div>
                  <span>Por Equipe Menu ZN</span>
                </div>
              )}
              
              <span aria-hidden="true" className="text-on-surface/35">•</span>
              <span>{formatDate(post.published_at)}</span>
              <span aria-hidden="true" className="text-on-surface/35">•</span>
              <span>{estimateReadTime(post.content_md)}</span>
              {isPreview ? (
                <>
                  <span aria-hidden="true" className="text-on-surface/35">•</span>
                  <span className="rounded-full border border-on-surface/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                    Pré-visualização
                  </span>
                </>
              ) : (
                <>
                  <span aria-hidden="true" className="text-on-surface/35">•</span>
                  <BlogViewTracker slug={post.slug} initialViewCount={post.view_count} />
                </>
              )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-5 pb-8 sm:px-8 md:px-18 md:pb-12">
        <div className="relative aspect-2/1 overflow-hidden rounded-[14px] bg-[#e7e0d8]">
          <Image
            src={post.cover_image_url ?? "/images/hero-blog-destaque.png"}
            alt={post.title}
            fill
            unoptimized={Boolean(post.cover_image_url)}
            className="object-cover object-center md:object-[center_35%]"
            priority
          />
        </div>
      </section>

      <section className="mx-auto max-w-245 px-6 py-10 md:px-10 lg:px-12 lg:py-20">
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
            <article className="blog-rich-editor blog-article-content text-on-surface">
              {renderContent(post.content_md) ?? (
                <p className="text-[17px] leading-8 text-on-surface/90 whitespace-pre-line">
                  {post.excerpt ?? "Conteúdo em atualização."}
                </p>
              )}
            </article>

            <BlogShareBar
              title={post.title}
              url={`https://www.menuzonanorte.com.br/blog/${post.slug}`}
            />

            <div className="mt-16 rounded-[28px] border border-outline/20 bg-[#faf8f5] p-8 md:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {post.authors?.avatar_url ? (
                  <Image
                    src={post.authors.avatar_url}
                    alt={post.authors.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-full object-cover"
                  />
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
                  {post.authors?.instagram_url && authorInstagramHandle ? (
                    <a
                      href={post.authors.instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-[rgb(148_53_21)] underline decoration-[rgb(148_53_21)]/35 underline-offset-2 transition hover:decoration-[rgb(148_53_21)]"
                    >
                      {authorInstagramHandle}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <BlogTestimonialForm postId={post.id} postSlug={post.slug} />

            {testimonials.length > 0 ? (
              <section className="mt-10" aria-labelledby="published-comments-heading">
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[rgb(148_53_21)]">
                      Comentários publicados
                    </p>
                    <h2 id="published-comments-heading" className="mt-2 font-serif text-3xl text-on-surface">
                      O que os leitores disseram
                    </h2>
                  </div>
                  <span className="text-sm text-on-surface/60">
                    {testimonials.length} {testimonials.length === 1 ? "comentário" : "comentários"}
                  </span>
                </div>

                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <article
                      key={testimonial.id}
                      className="rounded-[22px] border border-outline/25 bg-white p-6 shadow-sm md:p-7"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#faf3ee] font-serif text-lg text-[rgb(148_53_21)]">
                          {testimonial.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-on-surface">{testimonial.author_name}</h3>
                          {testimonial.author_role ? (
                            <p className="text-xs text-on-surface/55">{testimonial.author_role}</p>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-on-surface/80">
                        {testimonial.content}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
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
                const itemCategory = getCategoryName(item.blog_categories);

                return (
                  <Link key={item.id} href={`/blog/${item.slug}`} className="group overflow-hidden rounded-[26px] border border-outline/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={item.cover_image_url ?? "/images/hero-blog-destaque.png"}
                        alt={item.title}
                        fill
                        unoptimized={Boolean(item.cover_image_url)}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-3 p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[rgb(148_53_21)]">
                        {itemCategory ?? "Artigo"}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface/50">
                        <Eye size={14} aria-hidden="true" />
                        {formatViewCount(item.view_count)}
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
