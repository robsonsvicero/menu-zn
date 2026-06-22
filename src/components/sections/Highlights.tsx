import { Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchPublishedEstablishments } from '@/lib/establishments-public'

export default async function Highlights() {
  let items = [] as Awaited<ReturnType<typeof fetchPublishedEstablishments>>

  try {
    items = await fetchPublishedEstablishments({ featuredOnly: true, sort: 'featured', limit: 4 })
  } catch (error) {
    if (typeof error === 'object' && error && 'digest' in error && (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE') {
      throw error
    }
    console.error('Highlights: falha ao carregar dados', error)
    return null
  }

  if (items.length === 0) return null

  return (
    <section className="w-full bg-background py-16 px-6 md:px-16 lg:px-30">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 md:gap-0">
        <div>
          <p className="text-primary text-[11px] font-bold tracking-widest uppercase mb-2">
            Seleção Mensal
          </p>
          <h2 className="font-serif text-4xl md:text-[44px] text-on-surface font-bold">
            Destaques da Semana
          </h2>
        </div>
        <Link
          href="/restaurantes"
          className="flex items-center gap-2 text-muted hover:text-on-surface transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          Ver Todos <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/local/${item.slug}`}
            className="group flex flex-col bg-surface rounded-2xl overflow-hidden border border-transparent hover:border-outline/50 transition-all shadow-sm hover:shadow-md"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-4/5 bg-gray-100 overflow-hidden">
              <Image
                src={item.image_cover_url || '/images/hero-restaurantes.png'}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Category Badge */}
              {item.categories?.[0]?.name && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
                  <span className="text-[10px] font-bold text-on-surface tracking-wider uppercase">
                    {item.categories[0].name}
                  </span>
                </div>
              )}

              {/* iFood Badge */}
              {item.has_ifood && (
                <div className="absolute top-4 right-4 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                  <Star size={12} className="fill-current" />
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col grow">
              {/* Rating */}
              {item.rating !== null && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Star size={14} className="text-[#F5A623] fill-current" />
                  <span className="text-primary font-bold text-sm">{item.rating.toFixed(1)}</span>
                </div>
              )}

              {/* Title */}
              <h3 className="font-serif text-3xl text-on-surface font-normal mb-8">
                {item.name}
              </h3>

              {/* Spacer to push footer down */}
              <div className="grow" />

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs font-medium">
                  {item.neighborhoods?.[0]?.name ?? 'Zona Norte'}
                </span>
                {item.price_range && (
                  <span className="text-[#A25F4B] font-bold text-sm tracking-widest">{item.price_range}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
