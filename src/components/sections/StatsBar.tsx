import { Search, MousePointerClick, TrendingUp, MapPin, Building2 } from 'lucide-react'

import { fetchEstablishmentStats } from '@/lib/establishments-public'

import type { ReactNode } from 'react'

interface StatItem {
  icon: ReactNode
  value: string
  label: string
}

export default async function StatsBar() {
  const establishmentStats = await fetchEstablishmentStats().catch(() => ({
    published: 0,
  }))

  const publishedEstablishments = new Intl.NumberFormat('pt-BR').format(
    establishmentStats.published
  )

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
      icon: <Building2 size={18} strokeWidth={1.5} />,
      value: publishedEstablishments,
      label: 'Estabelecimentos\ncadastrados',
    },
    {
      icon: <TrendingUp size={18} strokeWidth={1.5} />,
      value: '8,1',
      label: 'Posição média\nno Google',
    },
    {
      icon: <MapPin size={18} strokeWidth={1.5} />,
      value: '100%',
      label: 'Focado na Zona Norte\nde São Paulo',
    },
  ]

  return (
    <section className="w-full bg-[#1c1c1c] py-7 px-6 md:px-16 lg:px-30">
      {/* Stats row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Icon circle */}
            <div className="shrink-0 w-10 h-10 rounded-full border border-[#D69869]/50 flex items-center justify-center text-[#D69869]">
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
