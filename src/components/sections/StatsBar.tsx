'use client'

import { Search, MousePointerClick, TrendingUp, MapPin } from 'lucide-react'

interface StatItem {
  icon: React.ReactNode
  value: string
  label: string
}

const stats: StatItem[] = [
  {
    icon: <Search size={18} strokeWidth={1.5} />,
    value: '+26 MIL',
    label: 'Impressões mensais\nno Google',
  },
  {
    icon: <MousePointerClick size={18} strokeWidth={1.5} />,
    value: '+300',
    label: 'Cliques qualificados\npor mês',
  },
  {
    icon: <TrendingUp size={18} strokeWidth={1.5} />,
    value: '7,8',
    label: 'Posição média\nno Google',
  },
  {
    icon: <MapPin size={18} strokeWidth={1.5} />,
    value: '100%',
    label: 'Focado na Zona Norte\nde São Paulo',
  },
]

export default function StatsBar() {
  return (
    <section className="w-full bg-[#1c1c1c] py-7 px-6 md:px-16 lg:px-[120px]">
      {/* Stats row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Icon circle */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#D69869]/50 flex items-center justify-center text-[#D69869]">
              {stat.icon}
            </div>

            {/* Text */}
            <div>
              <p className="font-sans text-[#D69869] text-lg font-semibold leading-none tracking-wide">
                {stat.value}
              </p>
              <p className="font-sans text-[#888888] text-[10px] uppercase tracking-widest leading-snug mt-1 whitespace-pre-line">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-5 text-center font-sans text-[#666666] text-[11px]">
        Dados atualizados semanalmente via{' '}
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#5b9bd5] hover:underline transition-colors duration-200"
        >
          Google Search Console
        </a>
      </p>
    </section>
  )
}
