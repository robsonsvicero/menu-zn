'use client'

import { CheckCircle2 } from 'lucide-react'

export default function CtaAdvertise() {
  const benefits = [
    'POSIÇÃO DE DESTAQUE NO SITE',
    'DIVULGAÇÃO NO INSTAGRAM (MAIS DE 25 MIL SEGUIDORES)',
    'VÍDEOS PROFISSIONAIS DO SEU NEGÓCIO',
    'AUMENTO REAL DE VISIBILIDADE E CLIENTES',
  ]

  return (
    <section className="w-full px-6 md:px-16 lg:px-[120px] py-16 bg-on-surface/5">
      <div className="bg-[#222222] rounded-[32px] p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-12 w-full">
        
        {/* Left Icon (Decorative Chart) */}
        <div className="hidden lg:flex items-end gap-3 flex-shrink-0">
          <div className="w-[30px] h-[60px] bg-[#333333] rounded-xl" />
          <div className="w-[30px] h-[100px] bg-[#333333] rounded-xl" />
          <div className="w-[30px] h-[80px] bg-[#333333] rounded-xl" />
        </div>

        {/* Center Content */}
        <div className="flex-1 max-w-3xl">
          <h2 className="font-serif text-[32px] md:text-[36px] leading-[1.2] text-white font-bold mb-4">
            Seu restaurante na frente de milhares<br className="hidden md:block" /> de clientes todos os meses
          </h2>
          
          <p className="text-secondary text-sm font-semibold mb-8">
            Planos a partir de R$ 97/mês com destaque no site, Instagram e vídeos exclusivos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {benefits.map((text, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-secondary flex-shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-[10px] md:text-[11px] text-muted font-semibold tracking-wide uppercase leading-snug">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <a href="/anunciar">
            <button className="w-full lg:w-auto bg-[#D69869] hover:bg-[#c28659] text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-2xl transition-colors shadow-lg">
              Anunciar Agora
            </button>
          </a>
        </div>

      </div>
    </section>
  )
}
