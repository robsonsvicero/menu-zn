'use client'

import Image from 'next/image'

interface Testimonial {
  id: string
  quote: string
  name: string
  company: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: '"Desde que anunciamos no Menu Zona Norte, nosso movimento aumentou significativamente. O público que vem através do guia é exatamente quem buscamos."',
    name: 'Marcelo A.',
    company: 'QUINTAL DO ESPETO',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '2',
    quote: '"A visibilidade no Instagram e no portal trouxe muitos clientes novos. A curadoria deles passa uma credibilidade que outros canais não oferecem."',
    name: 'Juliana M.',
    company: 'BUTEQUIM DO LELECO',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  {
    id: '3',
    quote: '"Os vídeos produzidos pela equipe do Menu ZN fizeram toda a diferença. Somos referência na região graças a essa parceria estratégica."',
    name: 'Ricardo S.',
    company: 'LEGGERA PIZZA',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
  }
]

export default function Testimonials() {
  return (
    <section className="w-full  bg-on-surface/5 py-20 px-6 md:px-16 lg:px-[120px]">
      {/* Header */}
      <div className="flex justify-center mb-16 text-center">
        <h2 className="font-serif text-[40px] md:text-[44px] text-on-surface font-bold">
          O que nossos parceiros dizem
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col bg-surface rounded-[32px] p-10 border border-outline/30 shadow-sm"
          >
            {/* Quote Icon / Mark */}
            <div className="mb-6">
              <span className="font-serif font-black text-6xl text-primary leading-none">
                ”
              </span>
            </div>

            {/* Testimonial Text */}
            <p className="font-sans italic text-muted text-[15px] leading-relaxed flex-grow mb-10">
              {item.quote}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4 mt-auto">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image 
                  src={item.avatar} 
                  alt={`Foto de ${item.name}`}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-on-surface font-bold text-sm">
                  {item.name}
                </span>
                <span className="text-[#a8a8a8] text-[10px] font-bold tracking-widest uppercase mt-0.5">
                  {item.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
