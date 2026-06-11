'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface ArticleItem {
  id: string
  tag: string
  title: string
  excerpt: string
  image: string
}

const articles: ArticleItem[] = [
  {
    id: '1',
    tag: 'Tendências',
    title: '10 Melhores restaurantes para conhecer em 2024',
    excerpt: 'Nossa equipe percorreu cada rua para encontrar as jóias escondidas que você precisa visitar este ano.',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    tag: 'Guia Rápido',
    title: 'O roteiro definitivo dos hambúrgueres artesanais',
    excerpt: 'Do pão brioche ao blend secreto: onde encontrar a mordida perfeita na região.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    tag: 'Noite',
    title: 'Happy Hour: os terraços com a melhor vista da ZN',
    excerpt: 'Aproveite o pôr do sol com drinques autorais nos rooftops mais cobiçados do momento.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800'
  }
]

export default function Chronicles() {
  return (
    <section className="w-full bg-background py-16 px-6 md:px-16 lg:px-[120px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 md:gap-0">
        <h2 className="font-serif text-4xl md:text-[44px] text-on-surface font-bold">
          Crônicas Gastronômicas
        </h2>
        <a 
          href="/blog" 
          className="flex items-center gap-2 text-muted hover:text-on-surface transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          Todos os Artigos <ArrowRight size={14} />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article) => (
          <a key={article.id} href={`/blog/${article.id}`} className="group flex flex-col cursor-pointer">
            {/* Image */}
            <div className="relative w-full aspect-[3/2] rounded-[24px] overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
              <Image 
                src={article.image} 
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Tag */}
            <span className="text-[#A25F4B] text-[10px] font-bold tracking-[0.15em] uppercase mb-3">
              {article.tag}
            </span>

            {/* Title */}
            <h3 className="font-serif text-[26px] leading-tight text-on-surface mb-3 group-hover:text-primary transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-muted text-sm leading-relaxed font-sans">
              {article.excerpt}
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
