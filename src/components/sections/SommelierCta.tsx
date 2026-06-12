'use client'

import { useState } from 'react'
import { Wine } from 'lucide-react'

export default function SommelierCta() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('E-mail cadastrado:', email)
    setEmail('')
  }

  return (
    <section className="w-full bg-surface py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="bg-[#2C2927] rounded-[40px] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
          
          {/* Left Content */}
          <div className="flex-1 max-w-2xl relative z-10">
            <p className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Sommelier Digital
            </p>
            
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[56px] text-white font-bold leading-[1.15] mb-6">
              Receba curadorias<br className="hidden md:block" /> exclusivas no seu<br className="hidden md:block" /> e-mail
            </h2>
            
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-10 max-w-lg font-light">
              Semanalmente, selecionamos uma experiência<br className="hidden md:block" />
              completa: do prato principal à harmonização perfeita,<br className="hidden md:block" />
              com benefícios exclusivos em nossos parceiros.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#3E3A38] border border-transparent focus:border-outline/30 focus:bg-[#45403e] outline-none text-white px-6 py-4 rounded-2xl placeholder:text-white/40 text-sm transition-all"
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-[#8B3113] text-white font-bold text-[11px] uppercase tracking-widest px-8 py-4 rounded-2xl transition-colors whitespace-nowrap"
              >
                Inscrever-se
              </button>
            </form>
          </div>

          {/* Right Content / Icon */}
          <div className="hidden lg:flex flex-shrink-0 items-center justify-center relative z-10 mr-10">
            <div className="w-48 h-48 rounded-full border border-white/5 bg-white/5 flex items-center justify-center relative backdrop-blur-sm">
              {/* Custom SVG matching the geometric wine glass from the image */}
              <svg 
                width="64" 
                height="80" 
                viewBox="0 0 64 80" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#B06D56]"
              >
                <path d="M4 4H60V24C60 38.3594 48.3594 50 34 50H30C15.6406 50 4 38.3594 4 24V4Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="round"/>
                <path d="M4 24H60" stroke="currentColor" strokeWidth="6"/>
                <path d="M32 50V76" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                <path d="M16 76H48" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
