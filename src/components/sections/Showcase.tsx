import { Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { fetchPublishedEstablishments } from '@/lib/establishments-public'

export default async function Showcase() {
  const items = await fetchPublishedEstablishments({ indicatedOnly: true, sort: 'featured', limit: 6 })

  if (items.length === 0) return null

  return (
    <section className="w-full bg-transparent py-16 px-6 md:px-16 lg:px-[120px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 md:gap-0">
        <div>
          <p className="text-primary text-[11px] font-bold tracking-widest uppercase mb-2">
            Localizações Encontradas
          </p>
          <h2 className="font-serif text-4xl md:text-[44px] text-on-surface font-bold">
            Indicações
          </h2>
        </div>
        <Link 
          href="/indicacoes" 
          className="flex items-center gap-2 text-muted hover:text-on-surface transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          Ver Todos <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={`/local/${item.slug}`}
            className="flex flex-col bg-surface rounded-[20px] overflow-hidden border border-outline/40 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative w-full h-[220px] overflow-hidden">
              <Image 
                src={item.image_cover_url || '/images/hero-restaurantes.png'} 
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              
              {/* Neighborhood Badge */}
              {item.neighborhoods?.[0]?.name && (
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                  <span className="text-[9px] font-bold text-on-surface tracking-wider uppercase">
                    {item.neighborhoods[0].name}
                  </span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-4">
                {item.categories?.[0]?.name ? (
                  <div className="bg-gray-100 px-2 py-1 rounded">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {item.categories[0].name}
                    </span>
                  </div>
                ) : <div />}
                
                {item.rating !== null && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-[#F5A623] fill-current" />
                    <span className="text-on-surface font-bold text-sm">{item.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-serif text-[22px] leading-snug text-on-surface font-bold mb-3">
                {item.name}
              </h3>

              {/* Description */}
              {item.short_description && (
                <p className="text-[10px] text-muted tracking-wider uppercase leading-[1.6] mb-5">
                  {item.short_description}
                </p>
              )}

              <div className="flex-grow" />

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-outline/40 pt-4 mt-4">
                <span className="text-[10px] font-bold tracking-widest text-on-surface uppercase">
                  GUIA ZN
                </span>
                {item.price_range && (
                  <span className="text-primary font-bold text-xs tracking-wider">
                    {item.price_range}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
