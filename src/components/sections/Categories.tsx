'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface CategoryItem {
  id: string
  title: string
  subtitle: string
  image: string
  href: string
}

const categories: CategoryItem[] = [
  {
    id: '1',
    title: 'Restaurantes',
    subtitle: 'DESCOBRIR LOCAIS',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600&h=800',
    href: '/restaurantes'
  },
  {
    id: '2',
    title: 'Bares',
    subtitle: 'HAPPY HOUR',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600&h=800',
    href: '/bares'
  },
  {
    id: '3',
    title: 'Pizzarias',
    subtitle: 'MELHORES MASSAS',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600&h=800',
    href: '/pizzarias'
  },
  {
    id: '4',
    title: 'Padarias',
    subtitle: 'CAFÉ & BRUNCH',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600&h=800',
    href: '/padarias'
  }
]

export default function Categories() {
  return (
    <section className="w-full bg-on-surface/5 py-16 px-6 md:px-16 lg:px-[120px]">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="font-serif text-4xl md:text-[44px] text-on-surface font-bold mb-4">
          Explore por Categoria
        </h2>
        <p className="text-[#666666] font-sans text-sm md:text-base max-w-lg">
          Navegue pelos melhores estabelecimentos divididos por especialidade.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.href}
            className="group relative flex flex-col justify-end w-full aspect-[3/4] rounded-[32px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <Image 
              src={category.image} 
              alt={category.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Content */}
            <div className="relative z-10 p-8 flex flex-col items-center text-center">
              <h3 className="font-serif text-[32px] text-white font-normal mb-2 tracking-wide">
                {category.title}
              </h3>
              <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
                  {category.subtitle}
                </span>
                <ArrowRight size={12} strokeWidth={2.5} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
