import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'

type Bakery = {
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

const bakeries: Bakery[] = [
  {
    id: '1',
    name: 'Padaria Estado Luso',
    category: 'TRADICIONAL',
    neighborhood: 'VILA PAULICEIA',
    price: '$$',
    description: 'Um ícone da Zona Norte há décadas. Famosa pelo pão na chapa com crosta perfeita, doces portugueses autênticos e aquele clima nostálgico de padaria de bairro.',
    address: 'Av. Águas de São Pedro, 298 - Vila Pauliceia',
    phone: '(11) 2959-1234',
    imageUrl: '/images/hero-menuzn.png',
    hasIfood: true,
    distance: 1.8,
  },
  {
    id: '2',
    name: 'A Lareira',
    category: 'ARTESANAL',
    neighborhood: 'SANTANA',
    price: '$$$',
    description: 'Padaria e confeitaria artesanal com ambiente acolhedor. O café da manhã aos domingos é tradição na região, com buffet farto e pães de fermentação natural.',
    address: 'Av. Dep. Emílio Carlos, 718 - Santana',
    phone: '(11) 2281-5555',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: true,
    distance: 0.3,
  },
  {
    id: '3',
    name: 'Panetteria ZN',
    category: '24 HORAS',
    neighborhood: 'MANDAQUI',
    price: '$$',
    description: 'A queridinha da madrugada! Gigante, moderna e com uma variedade impressionante de lanches e pratos a qualquer hora do dia ou da noite.',
    address: 'Av. Eng. Caetano Álvares, 4740 - Mandaqui',
    phone: '(11) 2236-6000',
    imageUrl: '/images/hero-zonanorte.png',
    hasIfood: true,
    distance: 4.2,
  },
  {
    id: '4',
    name: 'Saint Tropez',
    category: 'BOUTIQUE',
    neighborhood: 'JARDIM SÃO PAULO',
    price: '$$$',
    description: 'Inspirada nas clássicas boulangeries francesas, oferece doces finos, croissants folhados e tortas que são verdadeiras obras de arte na vitrine.',
    address: 'R. Carlos Escobar, 100 - Jardim São Paulo',
    phone: '(11) 2977-8899',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: false,
    distance: 1.1,
  },
]

type BakeryGridProps = {
  isIfoodActive: boolean
  activeSort: string | null
  searchQuery: string
}

export default function BakeryGrid({ isIfoodActive, activeSort, searchQuery }: BakeryGridProps) {
  const filteredBakeries = bakeries.filter(bakery => {
    const matchesIfood = isIfoodActive ? bakery.hasIfood : true
    const matchesSearch = searchQuery
      ? bakery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bakery.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bakery.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bakery.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesIfood && matchesSearch
  })

  const sortedBakeries = [...filteredBakeries].sort((a, b) => {
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
          {sortedBakeries.map((bakery) => (
            <div 
              key={bakery.id} 
              className="bg-white rounded-3xl border border-outline/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 md:h-72">
                <Image
                  src={bakery.imageUrl}
                  alt={bakery.name}
                  fill
                  className="object-cover"
                />
                {/* iFood Badge */}
                {bakery.hasIfood && (
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
                    {bakery.name}
                  </h3>
                  <span className="text-on-surface-variant text-sm font-medium pt-2">
                    {bakery.price}
                  </span>
                </div>

                {/* Category & Neighborhood */}
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  {bakery.category} • {bakery.neighborhood}
                </p>

                {/* Description */}
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {bakery.description}
                </p>

                <div className="mt-auto">
                  {/* Divider */}
                  <hr className="border-outline/20 mb-4" />

                  {/* Footer details */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin size={14} className="shrink-0" />
                      <span className="text-xs">{bakery.address} <span className="text-primary font-bold">({bakery.distance} km)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Phone size={14} className="shrink-0" />
                      <span className="text-xs">{bakery.phone}</span>
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
            Carregar Mais Padarias
          </button>
        </div>

      </div>
    </section>
  )
}
