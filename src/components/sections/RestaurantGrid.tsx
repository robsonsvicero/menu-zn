import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'

type Restaurant = {
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

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Lassù Rooftop',
    category: 'CONTEMPORÂNEA',
    neighborhood: 'SANTANA',
    price: '$$$$',
    description: 'Uma experiência gastronômica elevada com vista 360º de São Paulo. O menu autoral celebra ingredientes brasileiros com técnica italiana refinada.',
    address: 'R. Conselheiro Saraiva, 207 - Santana',
    phone: '(11) 2283-0611',
    imageUrl: '/images/hero-zonanorte.png',
    hasIfood: true,
    distance: 3.2,
  },
  {
    id: '2',
    name: 'Mocotó',
    category: 'BRASILEIRA',
    neighborhood: 'VILA MEDEIROS',
    price: '$$',
    description: 'O templo da cozinha sertaneja em São Paulo. Rodrigo Oliveira apresenta clássicos como o Dadinho de Tapioca e o Torresmo que conquistaram o mundo.',
    address: 'Av. Nossa Sra. do Loreto, 1100 - Vila Medeiros',
    phone: '(11) 2951-3056',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: false,
  },
  {
    id: '3',
    name: 'Dona Julia',
    category: 'PORTUGUESA',
    neighborhood: 'MANDAQUI',
    price: '$$$',
    description: 'Um pedaço de Portugal no coração da Zona Norte. Receitas de família que trazem o melhor do bacalhau e doces conventuais impecáveis.',
    address: 'R. Conselheiro Moreira de Barros, 2186',
    phone: '(11) 2950-4382',
    imageUrl: '/images/hero-menuzn.png',
    hasIfood: true,
    distance: 5.0,
  },
  {
    id: '4',
    name: 'Norte Grill',
    category: 'PARRILLA',
    neighborhood: 'JARDIM SÃO PAULO',
    price: '$$$',
    description: 'Referência em cortes nobres e serviço impecável. A verdadeira celebração do churrasco premium em um ambiente elegante e acolhedor.',
    address: 'Av. Luiz Dumont Villares, 1100',
    phone: '(11) 2976-5522',
    imageUrl: '/images/seu-manuel-restaurante.webp',
    hasIfood: false,
  },
]

type RestaurantGridProps = {
  isIfoodActive: boolean
  activeSort: string | null
  searchQuery: string
}

export default function RestaurantGrid({ isIfoodActive, activeSort, searchQuery }: RestaurantGridProps) {
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesIfood = isIfoodActive ? restaurant.hasIfood : true
    const matchesSearch = searchQuery
      ? restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesIfood && matchesSearch
  })

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
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
          {sortedRestaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="bg-white rounded-3xl border border-outline/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 md:h-72">
                <Image
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
                {/* iFood Badge */}
                {restaurant.hasIfood && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                    {/* Simple iFood-like icon placeholder */}
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
                    {restaurant.name}
                  </h3>
                  <span className="text-on-surface-variant text-sm font-medium pt-2">
                    {restaurant.price}
                  </span>
                </div>

                {/* Category & Neighborhood */}
                <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                  {restaurant.category} • {restaurant.neighborhood}
                </p>

                {/* Description */}
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  {restaurant.description}
                </p>

                <div className="mt-auto">
                  {/* Divider */}
                  <hr className="border-outline/20 mb-4" />

                  {/* Footer details */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin size={14} className="shrink-0" />
                      <span className="text-xs">{restaurant.address} <span className="text-primary font-bold">({restaurant.distance} km)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Phone size={14} className="shrink-0" />
                      <span className="text-xs">{restaurant.phone}</span>
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
            Carregar Mais Restaurantes
          </button>
        </div>

      </div>
    </section>
  )
}
