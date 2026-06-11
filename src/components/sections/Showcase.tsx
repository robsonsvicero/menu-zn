'use client'

import { Star, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ShowcaseItem {
  id: string
  neighborhood: string
  category: string
  rating: number
  title: string
  description: string
  quote: string
  author: string
  price: string
  image: string
}

const allItems: ShowcaseItem[] = [
  {
    id: '1',
    neighborhood: 'SERRA DA CANTAREIRA',
    category: 'RESTAURANTE',
    rating: 4.8,
    title: 'Mesa de Brasa Cantareira',
    description: 'COZINHA RÚSTICA DE BRASA TÉCNICA, ESCONDIDA ENTRE OS BOSQUES DA CANTAREIRA, REINVENTANDO BISTRÔS COM COGUMELOS E TRUFAS COLHIDAS NA MONTANHA.',
    quote: '"A simbiose rústica da fumaça amadeirada com as ervas silvestres frescas cultivadas aos pés da floresta nativa."',
    author: 'CHEF HELENA PRADO',
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    neighborhood: 'MANDAQUI',
    category: 'CAFÉ',
    rating: 4.7,
    title: 'Boutique do Café Mandaqui',
    description: 'CAFÉS COLHIDOS ARTESANALMENTE, TORRADOS LOCALMENTE EM PEQUENOS LOTES E HARMONIZADOS COM UMA CONFEITARIA FOLHADA TRADICIONAL.',
    quote: '"A doçura natural do grão catuaí amarelo casa de forma estonteante com o milfolhas amanteigado."',
    author: 'ROSANA PINHEIRO',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    neighborhood: 'PARADA INGLESA',
    category: 'BAR',
    rating: 4.7,
    title: 'Carbono Coquetelaria ZN',
    description: 'COQUETÉIS CLÁSSICOS REPENSADOS SOB MIXOLOGIA AUTORAL, ACOMPANHADOS DE CROQUETES ARTESANAIS CROCANTES NA ICÔNICA PARADA INGLESA.',
    quote: '"Uma carta de drinks requintada, celebrando o vigor urbano com infusões locais criativas e elegantes."',
    author: 'ROSANA PINHEIRO',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    neighborhood: 'JARDIM SÃO BENTO',
    category: 'RESTAURANTE',
    rating: 4.7,
    title: 'Adega e Bistrô São Bento',
    description: 'CARTA SELETA DE VINHOS DO VELHO MUNDO COMBINADOS A UM MENU MEDITERRÂNEO ELEGANTE NO CORAÇÃO DO JARDIM SÃO BENTO.',
    quote: '"O risoto de açafrão com frutos do mar grelhados e raspas cítricas de limão siciliano é absolutamente irretocável."',
    author: 'CHEF LUCAS ALVARENGA',
    price: '$$$$',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    neighborhood: 'SANTANA',
    category: 'PIZZARIA',
    rating: 4.9,
    title: 'Forno di Napoli',
    description: 'AUTÊNTICA PIZZA NAPOLETANA COM MASSA DE FERMENTAÇÃO NATURAL DE 48H, ASSADA NO FORNO A LENHA EM TEMPERATURA EXTREMA.',
    quote: '"A leveza da massa contrastando com o molho de tomate San Marzano é uma verdadeira viagem à Itália."',
    author: 'CRÍTICO LOCAL',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    neighborhood: 'TUCURUVI',
    category: 'HAMBURGUERIA',
    rating: 4.6,
    title: 'Smash & Co.',
    description: 'BLENDS EXCLUSIVOS DE CARNE WAGYU EM FORMATO SMASH, COM QUEIJO DERRETIDO E PÃO BRIOCHE TOSTADO NA MANTEIGA.',
    quote: '"A crosta perfeita da carne e o pão macio criam o equilíbrio definitivo que todo amante de hambúrguer procura."',
    author: 'GUIA ZN',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'
  }
]

export default function Showcase() {
  const [items, setItems] = useState<ShowcaseItem[]>([])

  useEffect(() => {
    // Embaralhar e selecionar até 6 itens no lado do cliente para evitar erro de hidratação
    const shuffled = [...allItems].sort(() => 0.5 - Math.random())
    setItems(shuffled.slice(0, 6))
  }, [])

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
        <a 
          href="/indicacoes" 
          className="flex items-center gap-2 text-muted hover:text-on-surface transition-colors text-xs font-semibold tracking-wider uppercase"
        >
          Ver Todos <ArrowRight size={14} />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col bg-surface rounded-[20px] overflow-hidden border border-outline/40 shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative w-full h-[220px] overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              
              {/* Neighborhood Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-[9px] font-bold text-on-surface tracking-wider uppercase">
                  {item.neighborhood}
                </span>
              </div>
            </div>

            {/* Content Container */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-100 px-2 py-1 rounded">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-[#F5A623] fill-current" />
                  <span className="text-on-surface font-bold text-sm">{item.rating}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif text-[22px] leading-snug text-on-surface font-bold mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[10px] text-muted tracking-wider uppercase leading-[1.6] mb-5">
                {item.description}
              </p>

              {/* Spacer to push quote down if descriptions vary */}
              <div className="flex-grow" />

              {/* Quote Box */}
              <div className="bg-[#FAF8F2] rounded-2xl p-5 mb-5">
                <p className="font-serif italic text-sm text-on-surface/80 leading-relaxed">
                  {item.quote}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-outline/40 pt-4">
                <span className="text-[10px] font-bold tracking-widest text-on-surface uppercase">
                  {item.author}
                </span>
                <span className="text-primary font-bold text-xs tracking-wider">
                  {item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
