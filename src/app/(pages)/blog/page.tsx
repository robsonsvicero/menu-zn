'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, BookOpen } from 'lucide-react'
import BlogFilterBar from '@/components/sections/BlogFilterBar'

type CategoryOption = 'TODOS' | 'RECEITAS' | 'VINHOS' | 'DICAS' | 'DRINKS'
type SortOption = 'recent' | 'popular'

interface ArticleItem {
  id: string
  tag: string
  category: Exclude<CategoryOption, 'TODOS'>
  title: string
  excerpt: string
  image: string
  views: number
  date: string
  dateLabel: string
  linkText: string
}

const articles: ArticleItem[] = [
  {
    id: '1',
    tag: 'RECEITAS',
    category: 'RECEITAS',
    title: 'Aprenda a Costurar Massa de Pão',
    excerpt: 'O Humberto Lisboa realmente põe a mão na massa. Sócio proprietário da Osteria da Onça, mostra como se...',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
    views: 1540,
    date: '2024-07-14',
    dateLabel: '14 Jul, 2024',
    linkText: 'LER MAIS'
  },
  {
    id: '2',
    tag: 'VINHOS',
    category: 'VINHOS',
    title: 'Rótulos Italianos: Uma Viagem Sensorial',
    excerpt: 'Descubra os vinhos que marcaram a história da Toscana e como...',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    views: 2890,
    date: '2024-07-10',
    dateLabel: '10 Jul, 2024',
    linkText: 'LER MAIS'
  },
  {
    id: '3',
    tag: 'DICAS',
    category: 'DICAS',
    title: 'O Verdadeiro Pão de Queijo',
    excerpt: 'Esqueça as misturas prontas. Revelamos os segredos da receita',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800',
    views: 3120,
    date: '2024-07-05',
    dateLabel: '05 Jul, 2024',
    linkText: 'LER MAIS'
  },
  {
    id: '4',
    tag: 'DRINKS & MIXOLOGIA',
    category: 'DRINKS',
    title: 'Drink Sem Glúten: A Nova Fronteira do Bar',
    excerpt: 'A intolerância e a sensibilidade ao glúten atingem cerca de 5% da população mundial. Descubra como os bares mais conceituados de São Paulo estão adaptando suas cartas com criatividade.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    views: 4500,
    date: '2024-07-02',
    dateLabel: '02 Jul, 2024',
    linkText: 'ABRIR GUIA DE MIXOLOGIA'
  },
  {
    id: '5',
    tag: 'RESTAURANTES',
    category: 'DICAS',
    title: 'Pizzaria Pizzatto: Tradição e Modernidade',
    excerpt: 'Inaugurada em 2014 no coração da zona norte, esta casa tradicional traz no nome o sobrenome da família fundadora e nas receitas o segredo de gerações.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    views: 1420,
    date: '2024-06-28',
    dateLabel: '28 Jun, 2024',
    linkText: 'LER CRÍTICA'
  },
  {
    id: '6',
    tag: 'DRINKS',
    category: 'DRINKS',
    title: 'Aperol: O Sol no Copo',
    excerpt: 'Nascido em 1919, o Aperol tornou-se o drink símbolo do verão paulistano. Exploramos as variações autorais encontradas nos terraços da ZN.',
    image: 'https://images.unsplash.com/photo-1574085733277-851d9d856a3a?auto=format&fit=crop&q=80&w=800',
    views: 2150,
    date: '2024-06-20',
    dateLabel: '20 Jun, 2024',
    linkText: 'VER RECEITA'
  }
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryOption>('TODOS')
  const [activeSort, setActiveSort] = useState<SortOption>('recent')

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'TODOS' ? true : article.category === activeCategory
    const matchesSearch = searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (activeSort === 'recent') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (activeSort === 'popular') {
      return b.views - a.views
    }
    return 0
  })

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Hero Section */}
      <section className="relative w-full h-[650px] md:h-[750px] flex items-center justify-center text-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-blog-destaque.png" 
            alt="A Reinvenção da Cozinha Regional por Raphael Zanon" 
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay to match image styling */}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Content Container */}
        <div className="container relative z-10 mx-auto px-4 md:px-8 mt-16 max-w-4xl flex flex-col items-center">
          {/* Badge */}
          <span className="bg-[#A25F4B] text-[10px] md:text-xs font-bold text-white tracking-[0.2em] px-4 py-2 rounded-full uppercase mb-6 shadow-sm">
            Destaque do Mês
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-6 max-w-3xl drop-shadow-md">
            A Reinvenção da Cozinha Regional por Raphael Zanon
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm md:text-base text-white/90 font-sans mb-10 max-w-2xl leading-relaxed text-center font-light drop-shadow-sm">
            Visitamos o novo espaço que está mudando o panorama gastronômico de Santana. Uma experiência que une técnica francesa e ingredientes locais com uma maestria raramente vista fora dos grandes eixos mundiais.
          </p>
          
          {/* Button */}
          <button className="bg-[#A25F4B] text-white hover:bg-[#8F503D] text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
            Ler Matéria Completa <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Filter Bar */}
      <BlogFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        activeSort={activeSort}
        setActiveSort={setActiveSort}
      />

      {/* Articles Grid Section */}
      <section className="py-20 px-6 md:px-16 lg:px-[120px]">
        <div className="container mx-auto">
          {sortedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {sortedArticles.map((article, index) => {
                // Determine styling based on index (0 to 5 pattern)
                const position = index % 6
                
                // Card 1: Horizontal wide (col-span-4)
                if (position === 0) {
                  return (
                    <a 
                      key={article.id} 
                      href={`/blog/${article.id}`} 
                      className="group md:col-span-4 flex flex-col md:flex-row cursor-pointer bg-white rounded-[24px] overflow-hidden border border-outline/15 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto">
                        <Image 
                          src={article.image} 
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                      <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-[#A25F4B] text-[10px] font-bold tracking-[0.15em] uppercase">
                              {article.tag}
                            </span>
                            <span className="text-on-surface-variant/70 text-xs font-medium">
                              {article.dateLabel}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl md:text-3xl lg:text-[32px] leading-tight text-on-surface mb-4 group-hover:text-[#A25F4B] transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-on-surface-variant text-sm leading-relaxed font-sans mb-6 line-clamp-3">
                            {article.excerpt}
                          </p>
                        </div>
                        <span className="text-[#A25F4B] hover:text-[#8F503D] text-[10px] font-bold tracking-[0.15em] uppercase flex items-center gap-1.5 mt-auto">
                          {article.linkText} <ArrowRight size={12} />
                        </span>
                      </div>
                    </a>
                  )
                }

                // Card 4: Horizontal wide dark theme (col-span-4)
                if (position === 3) {
                  return (
                    <a 
                      key={article.id} 
                      href={`/blog/${article.id}`} 
                      className="group md:col-span-4 flex flex-col md:flex-row cursor-pointer bg-[#252525] rounded-[24px] overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="w-full md:w-[60%] p-8 md:p-12 flex flex-col justify-between text-white">
                        <div>
                          <span className="text-[#A25F4B] text-[10px] font-bold tracking-[0.15em] uppercase block mb-6">
                            {article.tag}
                          </span>
                          <h3 className="font-serif text-3xl lg:text-[38px] leading-tight text-white mb-6 group-hover:text-white/90 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-white/75 text-sm leading-relaxed font-sans mb-8">
                            {article.excerpt}
                          </p>
                        </div>
                        <span className="text-white/90 hover:text-white text-[10px] font-bold tracking-[0.15em] uppercase flex items-center gap-1.5 mt-auto">
                          {article.linkText} <BookOpen size={13} className="ml-1" />
                        </span>
                      </div>
                      <div className="relative w-full md:w-[40%] aspect-[4/3] md:aspect-auto">
                        <Image 
                          src={article.image} 
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                    </a>
                  )
                }

                // Cards 2 & 3: Vertical regular (col-span-2)
                // Cards 5 & 6: Vertical medium (col-span-3)
                const spanClass = (position === 1 || position === 2) ? 'md:col-span-2' : 'md:col-span-3'
                
                return (
                  <a 
                    key={article.id} 
                    href={`/blog/${article.id}`} 
                    className={`group ${spanClass} flex flex-col cursor-pointer bg-white rounded-[24px] overflow-hidden border border-outline/15 shadow-sm hover:shadow-md transition-all duration-300`}
                  >
                    <div className="relative w-full aspect-[3/2] overflow-hidden">
                      <Image 
                        src={article.image} 
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                    </div>
                    <div className="p-8 flex flex-col grow justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[#A25F4B] text-[10px] font-bold tracking-[0.15em] uppercase">
                            {article.tag}
                          </span>
                          <span className="text-on-surface-variant/70 text-xs font-medium">
                            {article.dateLabel}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl md:text-2xl leading-snug text-on-surface mb-3 group-hover:text-[#A25F4B] transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed font-sans mb-6 line-clamp-3">
                          {article.excerpt}
                        </p>
                      </div>
                      <span className="text-[#A25F4B] hover:text-[#8F503D] text-[10px] font-bold tracking-[0.15em] uppercase flex items-center gap-1.5 mt-auto">
                        {article.linkText} <ArrowRight size={12} />
                      </span>
                    </div>
                  </a>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-on-surface-variant text-lg">Nenhuma matéria encontrada com os termos informados.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
