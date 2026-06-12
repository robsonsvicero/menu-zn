'use client'

import { useState } from 'react'
import { Search, ListFilter } from 'lucide-react'

type CategoryOption = 'TODOS' | 'RECEITAS' | 'VINHOS' | 'DICAS' | 'DRINKS'
type SortOption = 'recent' | 'popular'

type BlogFilterBarProps = {
  searchQuery: string
  setSearchQuery: (val: string) => void
  activeCategory: CategoryOption
  setActiveCategory: (val: CategoryOption) => void
  activeSort: SortOption
  setActiveSort: (val: SortOption) => void
}

const categories: CategoryOption[] = ['TODOS', 'RECEITAS', 'VINHOS', 'DICAS', 'DRINKS']

export default function BlogFilterBar({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  activeSort,
  setActiveSort,
}: BlogFilterBarProps) {
  const [openSortDropdown, setOpenSortDropdown] = useState(false)

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'recent':
        return 'Mais Recentes'
      case 'popular':
        return 'Mais Populares'
      default:
        return 'Mais Recentes'
    }
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-outline/20 py-4 shadow-sm transition-all">
      <div className="container mx-auto px-4 md:px-8 flex flex-col gap-4">
        
        {/* Top: Search Input */}
        <div className="relative w-full">
          <input 
            type="text"
            placeholder="Pesquise por crônicas, dicas ou receitas..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-outline/30 bg-white text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-on-surface-variant/60" />
        </div>

        {/* Bottom: Filter Options */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left Side: Category Pills */}
          <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
            {categories.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#A25F4B] text-white shadow-sm' 
                      : 'bg-[#f2efe9]/60 hover:bg-[#f2efe9] text-on-surface-variant'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          {/* Right Side: Sorting Dropdown */}
          <div className="relative shrink-0 w-full md:w-auto flex justify-end">
            <button 
              onClick={() => setOpenSortDropdown(!openSortDropdown)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-medium transition-colors"
            >
              <ListFilter size={18} />
              <span>Ordenar por: <span className="font-bold text-on-surface">{getSortLabel(activeSort)}</span></span>
            </button>

            {openSortDropdown && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-outline/20 rounded-xl shadow-lg py-2 z-50">
                <button 
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeSort === 'recent' ? 'text-primary bg-primary/5' : 'hover:bg-surface text-on-surface-variant'}`}
                  onClick={() => { setActiveSort('recent'); setOpenSortDropdown(false) }}
                >
                  Mais Recentes
                </button>
                <button 
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${activeSort === 'popular' ? 'text-primary bg-primary/5' : 'hover:bg-surface text-on-surface-variant'}`}
                  onClick={() => { setActiveSort('popular'); setOpenSortDropdown(false) }}
                >
                  Mais Populares
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Close dropdown overlay */}
      {openSortDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenSortDropdown(false)}></div>
      )}
    </div>
  )
}
