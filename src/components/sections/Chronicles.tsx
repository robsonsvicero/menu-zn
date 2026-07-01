import { ArrowRight, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatViewCount } from '@/lib/blog-format'
import { fetchPublishedBlogPosts, type BlogCategoryRelation } from '@/lib/blog-public'

function getCategoryName(value: BlogCategoryRelation) {
  return Array.isArray(value) ? value[0]?.name : value?.name
}

export default async function Chronicles() {
  let articles = [] as Awaited<ReturnType<typeof fetchPublishedBlogPosts>>

  try {
    articles = await fetchPublishedBlogPosts({ limit: 3 })
  } catch (error) {
    if (typeof error === 'object' && error && 'digest' in error && (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    console.error('Chronicles: falha ao carregar dados', error)
    return null
  }

  if (articles.length === 0) return null
  return (
    <section className="w-full bg-background py-16 px-6 md:px-16 lg:px-30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 md:gap-0">
        <h2 className="font-serif text-4xl md:text-[44px] text-on-surface font-bold">
          Crônicas Gastronômicas
        </h2>
        <Link
          href="/blog"
          className="flex items-center gap-2 text-muted hover:text-on-surface transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          Todos os Artigos <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.id} href={`/blog/${article.slug}`} className="group flex flex-col">
            {/* Image */}
            <div className="relative w-full aspect-3/2 rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
              <Image
                src={article.cover_image_url || 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800'}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Tag */}
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A25F4B]">
              <span>{getCategoryName(article.blog_categories) ?? 'Blog'}</span>
              <span className="inline-flex items-center gap-1.5 text-muted">
                <Eye size={13} aria-hidden="true" />
                {formatViewCount(article.view_count)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[26px] leading-tight text-on-surface mb-3 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted text-sm leading-relaxed font-sans">
              {article.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
