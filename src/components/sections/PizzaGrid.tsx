import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'

type Pizza = {
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

const pizzas: Pizza[] = [
  {
    id: '1',
    name: 'Bráz Pizzaria',
    category: 'TRADICIONAL',
    neighborhood: 'SANTANA',
    price: '$$$',
    description: 'Um clássico paulistano na Zona Norte. Massas de fermentação natural, ingredientes garimpados e a icônica pizza Castelões que é sucesso garantido.',
    address: 'R. Pedro Cacunda, 72 - Santana',
    phone: '(11) 2975-5555',
    imageUrl: '/images/hero-menuzn.png',
    hasIfood: true,
    distance: 2.1,
  },
  {
    id: '2',
    name: 'Meime Pizzaria',
    category: 'ARTESANAL',
    neighborhood: 'JARDIM SÃO PAULO',
    price: '$$',
    description: 'Pizzas artesanais com massa fininha e crocante, assadas em forno a lenha. O ambiente rústico e acolhedor torna a experiência ainda mais especial.',
    address: 'Av. Leôncio de Magalhães, 1000 - Jardim São Paulo',
    phone: '(11) 2283-1122',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: true,
    distance: 0.9,
  },
  {
    id: '3',
    name: 'A Pizza da Mooca',
    category: 'NAPOLITANA',
    neighborhood: 'VILA GUILHERME',
    price: '$$',
    description: 'O verdadeiro estilo napolitano: massa de longa fermentação, bordas alveoladas e ingredientes importados da Itália. Simplesmente inesquecível.',
    address: 'R. Joaquina Ramalho, 300 - Vila Guilherme',
    phone: '(11) 2951-8080',
    imageUrl: '/images/hero-zonanorte.png',
    hasIfood: false,
    distance: 5.5,
  },
  {
    id: '4',
    name: 'Marquespizzas',
    category: 'PAULISTANA',
    neighborhood: 'TUCURUVI',
    price: '$$$',
    description: 'Aquela pizza com bastante recheio, do jeito que o paulistano ama. Sabores tradicionais e invenções da casa em um ambiente perfeito para a família.',
    address: 'Av. Nova Cantareira, 2000 - Tucuruvi',
    phone: '(11) 2994-4444',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: true,
    distance: 3.4,
  },
]

type PizzaGridProps = {
  isIfoodActive: boolean
  activeSort: string | null
  searchQuery: string
}

export default function PizzaGrid({ isIfoodActive, activeSort, searchQuery }: PizzaGridProps) {
  const filteredPizzas = pizzas.filter(pizza => {
    const matchesIfood = isIfoodActive ? pizza.hasIfood : true
    const matchesSearch = searchQuery
      ? pizza.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pizza.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pizza.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pizza.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesIfood && matchesSearch
  })

  const sortedPizzas = [...filteredPizzas].sort((a, b) => {
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
          {sortedPizzas.map((pizza) => (
            <div 
              key={pizza.id} 
              className="bg-white rounded-3xl border border-outline/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 md:h-72">
                <Image
                  src={pizza.imageUrl}
                  alt={pizza.name}
                  fill
                  className="object-cover"
                />
                {/* iFood Badge */}
                {pizza.hasIfood && (
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
                    {pizza.name}
                  </h3>
                  <span className="text-on-surface-variant text-sm font-medium pt-2">
                    {pizza.price}
                  </span>
                </div>

                {/* Category & Neighborhood */}
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  {pizza.category} • {pizza.neighborhood}
                </p>

                {/* Description */}
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {pizza.description}
                </p>

                <div className="mt-auto">
                  {/* Divider */}
                  <hr className="border-outline/20 mb-4" />

                  {/* Footer details */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin size={14} className="shrink-0" />
                      <span className="text-xs">{pizza.address} <span className="text-primary font-bold">({pizza.distance} km)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Phone size={14} className="shrink-0" />
                      <span className="text-xs">{pizza.phone}</span>
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
            Carregar Mais Pizzarias
          </button>
        </div>

      </div>
    </section>
  )
}
