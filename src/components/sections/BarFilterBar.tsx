'use client'

import { useState } from 'react'
import { ChevronDown, SlidersHorizontal, Search } from 'lucide-react'

type FilterOption = {
  label: string
  value: string
}

const styles: FilterOption[] = [
  { label: 'Todos os Estilos', value: 'todos' },
  { label: 'Boteco Raiz', value: 'boteco' },
  { label: 'Cervejaria', value: 'cervejaria' },
  { label: 'Gastrobar', value: 'gastrobar' },
  { label: 'Pub', value: 'pub' },
]

const prices: FilterOption[] = [
  { label: 'Qualquer Preço', value: 'todos' },
  { label: '$ (Acessível)', value: '1' },
  { label: '$$ (Moderado)', value: '2' },
  { label: '$$$ (Caro)', value: '3' },
  { label: '$$$$ (Muito Caro)', value: '4' },
]

const neighborhoods: FilterOption[] = [
  { label: 'Todos os Bairros', value: 'todos' },
  { label: 'Santana', value: 'santana' },
  { label: 'Tucuruvi', value: 'tucuruvi' },
  { label: 'Mandaqui', value: 'mandaqui' },
  { label: 'Jardim São Paulo', value: 'jardim-sao-paulo' },
]

type BarFilterBarProps = {
  isIfoodActive: boolean
  setIsIfoodActive: (val: boolean) => void
  activeSort: string | null
  setActiveSort: (val: string | null) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
}

export default function BarFilterBar({ isIfoodActive, setIsIfoodActive, activeSort, setActiveSort, searchQuery, setSearchQuery }: BarFilterBarProps) {
  const [activeStyle, setActiveStyle] = useState<FilterOption | null>(null)
  const [activePrice, setActivePrice] = useState<FilterOption | null>(null)
  const [activeNeighborhood, setActiveNeighborhood] = useState<FilterOption | null>(null)

  const [openDropdown, setOpenDropdown] = useState<'style' | 'price' | 'neighborhood' | 'advanced' | null>(null)

  const toggleDropdown = (dropdown: 'style' | 'price' | 'neighborhood' | 'advanced') => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-outline/20 py-4 shadow-sm transition-all">
      <div className="container mx-auto px-4 md:px-8 flex flex-col gap-4">
        
        {/* Top: Search Input */}
        <div className="relative w-full">
          <input 
            type="text"
            placeholder="Pesquise por nome, especialidade ou bairro..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-outline/30 bg-white text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant/60" />
        </div>

        {/* Bottom: Filter Options */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Side: Dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          
          {/* Estilo Dropdown */}
          <div className="relative shrink-0">
            <button 
              onClick={() => toggleDropdown('style')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline/30 bg-white text-on-surface hover:border-primary/50 hover:text-primary transition-colors text-sm font-medium"
            >
              {activeStyle ? activeStyle.label : 'Estilo'}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === 'style' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'style' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-outline/20 rounded-xl shadow-lg py-2 z-50">
                {styles.map(s => (
                  <button 
                    key={s.value} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${activeStyle?.value === s.value ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
                    onClick={() => { setActiveStyle(s.value === 'todos' ? null : s); setOpenDropdown(null); }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preço Dropdown */}
          <div className="relative shrink-0">
            <button 
              onClick={() => toggleDropdown('price')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline/30 bg-white text-on-surface hover:border-primary/50 hover:text-primary transition-colors text-sm font-medium"
            >
              {activePrice ? activePrice.label : 'Preço'}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'price' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-outline/20 rounded-xl shadow-lg py-2 z-50">
                {prices.map(p => (
                  <button 
                    key={p.value} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${activePrice?.value === p.value ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
                    onClick={() => { setActivePrice(p.value === 'todos' ? null : p); setOpenDropdown(null); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bairro Dropdown */}
          <div className="relative shrink-0">
            <button 
              onClick={() => toggleDropdown('neighborhood')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline/30 bg-white text-on-surface hover:border-primary/50 hover:text-primary transition-colors text-sm font-medium"
            >
              {activeNeighborhood ? activeNeighborhood.label : 'Bairro'}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === 'neighborhood' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'neighborhood' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-outline/20 rounded-xl shadow-lg py-2 z-50">
                {neighborhoods.map(n => (
                  <button 
                    key={n.value} 
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors ${activeNeighborhood?.value === n.value ? 'text-primary font-bold bg-primary/5' : 'text-on-surface'}`}
                    onClick={() => { setActiveNeighborhood(n.value === 'todos' ? null : n); setOpenDropdown(null); }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Toggles & Advanced Filters */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          
          {/* iFood Toggle */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsIfoodActive(!isIfoodActive)}>
            <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">
              Delivery Próprio / iFood
            </span>
            <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isIfoodActive ? 'bg-primary' : 'bg-outline/30'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${isIfoodActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          <div className="w-px h-6 bg-outline/20 hidden md:block"></div>

          {/* Advanced Filters Button */}
          <div className="relative shrink-0">
            <button 
              onClick={() => toggleDropdown('advanced')}
              className={`text-on-surface transition-colors p-1 rounded-md ${openDropdown === 'advanced' ? 'text-primary bg-primary/10' : 'hover:text-primary hover:bg-surface'}`}
              aria-label="Filtros Avançados"
            >
              <SlidersHorizontal size={20} />
            </button>
            {openDropdown === 'advanced' && (
              <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-outline/20 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 text-xs font-bold text-outline uppercase tracking-wider">Ordenação</div>
                <button 
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeSort === 'price-high' ? 'text-primary font-bold bg-primary/10' : 'hover:bg-surface text-on-surface'}`}
                  onClick={() => { setActiveSort('price-high'); setOpenDropdown(null) }}
                >
                  Preço Mais Alto
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeSort === 'price-low' ? 'text-primary font-bold bg-primary/10' : 'hover:bg-surface text-on-surface'}`}
                  onClick={() => { setActiveSort('price-low'); setOpenDropdown(null) }}
                >
                  Preço Mais Baixo
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeSort === 'distance' ? 'text-primary font-bold bg-primary/10' : 'hover:bg-surface text-on-surface'}`}
                  onClick={() => { setActiveSort('distance'); setOpenDropdown(null) }}
                >
                  Distância
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
      
      {/* Invisible overlay to close dropdowns when clicking outside */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
      )}
    </div>
  )
}
