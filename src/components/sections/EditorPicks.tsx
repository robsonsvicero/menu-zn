'use client'

import { Star } from 'lucide-react'
import Image from 'next/image'

export default function EditorPicks() {
  return (
    <section className="w-full bg-transparent px-6 md:px-16 lg:px-[120px] py-16">
      <div className="flex flex-col md:flex-row bg-surface rounded-[32px] overflow-hidden border border-outline/30 shadow-sm w-full">
        
        {/* Left Image Area */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
          <Image 
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=1000"
            alt="Chef preparando prato"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Badge */}
          <div className="absolute top-6 left-6 bg-primary text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md">
            <Star size={10} className="fill-current" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Escolha da Crítica
            </span>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
          
          {/* Eyebrow */}
          <p className="text-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Descobertas do Editor
          </p>

          {/* Title */}
          <h2 className="font-serif italic text-4xl lg:text-[46px] leading-[1.1] text-on-surface font-bold mb-8">
            A Reinvenção da Cozinha Regional por Raphael Zanon
          </h2>

          {/* Excerpt */}
          <p className="font-sans italic text-on-surface/70 text-sm md:text-base leading-relaxed mb-10">
            "Visitamos o novo espaço que está mudando o panorama gastronômico de Santana. Uma experiência que une técnica francesa e ingredientes locais com uma maestria raramente vista fora dos grandes eixos mundiais."
          </p>

          {/* Action & Author */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-auto">
            <a href="/blog/raphael-zanon">
              <button className="bg-[#2f2e2e] hover:bg-black text-white text-[10px] font-bold tracking-widest uppercase px-8 py-4 rounded-2xl transition-colors">
                Ler a Matéria
              </button>
            </a>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/50 text-primary flex items-center justify-center font-bold text-xs">
                MA
              </div>
              <div className="flex flex-col">
                <span className="text-muted text-[9px] font-bold tracking-widest uppercase">
                  Por Marco
                </span>
                <span className="text-muted text-[9px] font-bold tracking-widest uppercase">
                  Antônio
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
