import { Eye, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatViewCount } from '@/lib/blog-format'
import { fetchPublishedBlogPosts, type BlogCategoryRelation } from '@/lib/blog-public'

function getCategoryName(value: BlogCategoryRelation) {
  return Array.isArray(value) ? value[0]?.name : value?.name
}

export default async function EditorPicks() {
  let posts = [] as Awaited<ReturnType<typeof fetchPublishedBlogPosts>>

  try {
    posts = await fetchPublishedBlogPosts({ limit: 1 })
  } catch (error) {
    if (typeof error === 'object' && error && 'digest' in error && (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    console.error('EditorPicks: falha ao carregar dados', error)
    return null
  }

  const post = posts[0]

  if (!post) return null

  const imageSrc = post.cover_image_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000'
  const category = getCategoryName(post.blog_categories) ?? 'Blog'

  return (
    <section className="w-full bg-transparent px-6 md:px-16 lg:px-30 py-16">
      <div className="flex flex-col md:flex-row bg-surface rounded-4xl overflow-hidden border border-outline/30 shadow-sm w-full">

        {/* Left Image Area */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            className="object-cover"
          />
          {/* Badge */}
          <div className="absolute top-6 left-6 bg-primary text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md">
            <Star size={10} className="fill-current" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {category}
            </span>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center">

          {/* Eyebrow */}
          <p className="text-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Descobertas do Editor
          </p>
          <p className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface/55">
            <Eye size={14} aria-hidden="true" />
            {formatViewCount(post.view_count)}
          </p>

          {/* Title */}
          <h2 className="font-serif italic text-4xl lg:text-[46px] leading-[1.1] text-on-surface font-bold mb-8">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-sans italic text-on-surface/70 text-sm md:text-base leading-relaxed mb-10">
              &ldquo;{post.excerpt}&rdquo;
            </p>
          )}

          {/* Action */}
          <div className="mt-auto">
            <Link href={`/blog/${post.slug}`}>
              <button className="bg-[#2f2e2e] hover:bg-black text-white text-[10px] font-bold tracking-widest uppercase px-8 py-4 rounded-2xl transition-colors">
                Ler a Matéria
              </button>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
