'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

export default function Hero() {
  const [search, setSearch] = useState('')

  return (
    <section
      className="relative min-h-[75vh] w-full flex items-center"
      style={{
        backgroundImage: 'url(/images/hero-menuzn.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
      }}
    >
      {/* Dark overlay — stronger on left side for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-16 lg:px-[120px] pt-20">
        <div className="max-w-xl">
          {/* Title */}
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-8 leading-[1.15]">
            Alta gastronomia na Zona Norte,{' '}
            <span className="font-serif italic ligatures font-normal">curada por especialistas.</span>
          </h1>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-3 bg-black/40 border border-white/20 rounded-lg px-5 py-3 max-w-md">
              <input
                type="text"
                placeholder="Restaurantes, pratos ou bairros..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
              />
              <button className="text-white/70 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 items-center flex-wrap">
            <a href="/restaurantes">
              <Button size="lg" variant="default" className="rounded-lg px-7">
                Explorar Restaurantes
              </Button>
            </a>
            <a href="#">
              <Button size="lg" variant="secondary" className="rounded-lg px-7">
                Anuncie seu negócio
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
