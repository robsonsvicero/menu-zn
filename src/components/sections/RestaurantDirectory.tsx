'use client'

import { useState } from 'react'
import FilterBar from './FilterBar'
import RestaurantGrid from './RestaurantGrid'

export default function RestaurantDirectory() {
  const [isIfoodActive, setIsIfoodActive] = useState(false)
  const [activeSort, setActiveSort] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <FilterBar 
        isIfoodActive={isIfoodActive} 
        setIsIfoodActive={setIsIfoodActive} 
        activeSort={activeSort}
        setActiveSort={setActiveSort}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <RestaurantGrid 
        isIfoodActive={isIfoodActive} 
        activeSort={activeSort}
        searchQuery={searchQuery}
      />
    </>
  )
}
