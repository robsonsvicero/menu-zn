import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'

type Bar = {
  id: string
  name: string
  category: string
  neighborhood: string
  price: string
  description: string
  address: string
  phone: string
  imageUrl: string
  hasIfood: boolean
  distance: number
}

const bars: Bar[] = [
  {
    id: '1',
    name: 'Cervejaria Tarantino',
    category: 'CERVEJARIA',
    neighborhood: 'LIMÃO',
    price: '$$',
    description: 'Um galpão industrial incrível com cervejas artesanais produzidas no local, mesas ao ar livre e muita cultura urbana. O point perfeito para o fim de semana.',
    address: 'R. Miguel Nelson Bechara, 316 - Limão',
    phone: '(11) 3284-9000',
    imageUrl: '/images/hero-menuzn.png',
    hasIfood: true,
    distance: 4.5,
  },
  {
    id: '2',
    name: 'Adega Original',
    category: 'BOTECO CHIQUE',
    neighborhood: 'SANTANA',
    price: '$$$',
    description: 'Comidinhas de boteco refinadas, porções generosas e drinks autorais em um ambiente descontraído. A feijoada aos sábados é lendária na região.',
    address: 'Av. Luiz Dumont Villares, 1944 - Santana',
    phone: '(11) 2978-7392',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: true,
    distance: 1.2,
  },
  {
    id: '3',
    name: 'Bar do Luiz Fernandes',
    category: 'TRADICIONAL',
    neighborhood: 'MANDAQUI',
    price: '$',
    description: 'Desde 1970 servindo o que há de melhor em petiscos. Famoso pelo "Bolinho de Carne" e batidas caseiras que atraem paulistanos de todas as regiões.',
    address: 'R. Augusto Tolle, 610 - Mandaqui',
    phone: '(11) 2971-1555',
    imageUrl: '/images/hero-zonanorte.png',
    hasIfood: false,
    distance: 2.8,
  },
  {
    id: '4',
    name: 'Gastrobar 1100',
    category: 'GASTROBAR',
    neighborhood: 'JARDIM SÃO PAULO',
    price: '$$$',
    description: 'Mistura perfeita entre alta gastronomia e coquetelaria moderna. Um bar elegante para noites especiais, com música ambiente e carta de vinhos impecável.',
    address: 'Av. Leôncio de Magalhães, 1100 - Jardim São Paulo',
    phone: '(11) 2955-4422',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: false,
    distance: 0.5,
  },
]

type BarGridProps = {
  isIfoodActive: boolean
  activeSort: string | null
  searchQuery: string
}

export default function BarGrid({ isIfoodActive, activeSort, searchQuery }: BarGridProps) {
  const filteredBars = bars.filter(bar => {
    const matchesIfood = isIfoodActive ? bar.hasIfood : true
    const matchesSearch = searchQuery
      ? bar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bar.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bar.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bar.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesIfood && matchesSearch
  })

  const sortedBars = [...filteredBars].sort((a, b) => {
    if (activeSort === 'price-high') {
      return b.price.length - a.price.length;
    } else if (activeSort === 'price-low') {
      return a.price.length - b.price.length;
    } else if (activeSort === 'distance') {
      return a.distance - b.distance;
    }
    return 0;
  });

  return (
    <section className="py-12 bg-surface">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {sortedBars.map((bar) => (
            <div 
              key={bar.id} 
              className="bg-white rounded-3xl border border-outline/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 md:h-72">
                <Image
                  src={bar.imageUrl}
                  alt={bar.name}
                  fill
                  className="object-cover"
                />
                {/* iFood Badge */}
                {bar.hasIfood && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-white block"></span>
                    iFood
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-8 flex flex-col grow">
                
                {/* Header: Title & Price */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-3xl font-serif text-on-surface leading-tight">
                    {bar.name}
                  </h3>
                  <span className="text-on-surface-variant text-sm font-medium pt-2">
                    {bar.price}
                  </span>
                </div>

                {/* Category & Neighborhood */}
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  {bar.category} • {bar.neighborhood}
                </p>

                {/* Description */}
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {bar.description}
                </p>

                <div className="mt-auto">
                  {/* Divider */}
                  <hr className="border-outline/20 mb-4" />

                  {/* Footer details */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin size={14} className="shrink-0" />
                      <span className="text-xs">{bar.address} <span className="text-primary font-bold">({bar.distance} km)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Phone size={14} className="shrink-0" />
                      <span className="text-xs">{bar.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-16 flex justify-center">
          <button className="bg-[#f2efe9] text-primary border border-outline/10 text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
            Carregar Mais Bares
          </button>
        </div>

      </div>
    </section>
  )
}
