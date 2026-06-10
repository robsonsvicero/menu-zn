'use client'

import { Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface HighlightItem {
  id: string
  title: string
  location: string
  price: string
  rating: number
  category: string
  promoted?: boolean
  image: string
}

const items: HighlightItem[] = [
  {
    id: '1',
    title: 'Manioca JK',
    location: 'São Paulo, Santana',
    price: '$$$',
    rating: 4.9,
    category: 'RESTAURANTE',
    promoted: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600&h=800'
  },
  {
    id: '2',
    title: "Leleco's",
    location: 'São Paulo, Tucuruvi',
    price: '$$',
    rating: 4.7,
    category: 'BAR',
    promoted: false,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600&h=800'
  },
  {
    id: '3',
    title: 'Leggera',
    location: 'São Paulo, Parada Inglesa',
    price: '$$$',
    rating: 4.9,
    category: 'PIZZARIA',
    promoted: false,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600&h=800'
  },
  {
    id: '4',
    title: 'Bella Vitória',
    location: 'São Paulo, Jardim São Paulo',
    price: '$$',
    rating: 4.8,
    category: 'PADARIA',
    promoted: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600&h=800'
  }
]

export default function Highlights() {
  return (
    <section className="w-full bg-background py-16 px-6 md:px-16 lg:px-[120px]">
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
        <a 
          href="/destaques" 
          className="flex items-center gap-2 text-muted hover:text-on-surface transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          Ver Todos <ArrowRight size={14} />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group flex flex-col bg-surface rounded-2xl overflow-hidden border border-transparent hover:border-outline/50 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
                <span className="text-[10px] font-bold text-on-surface tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Promoted Star Badge */}
              {item.promoted && (
                <div className="absolute top-4 right-4 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                  <Star size={12} className="fill-current" />
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="p-5 flex flex-col flex-grow">
              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-2">
                <Star size={14} className="text-[#F5A623] fill-current" />
                <span className="text-primary font-bold text-sm">{item.rating}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-3xl text-on-surface font-normal mb-8">
                {item.title}
              </h3>

              {/* Spacer to push footer down */}
              <div className="flex-grow" />

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs font-medium">{item.location}</span>
                <span className="text-[#A25F4B] font-bold text-sm tracking-widest">{item.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
