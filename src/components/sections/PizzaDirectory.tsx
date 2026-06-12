'use client'

import { useState } from 'react'
import PizzaFilterBar from './PizzaFilterBar'
import PizzaGrid from './PizzaGrid'

export default function PizzaDirectory() {
  const [isIfoodActive, setIsIfoodActive] = useState(false)
  const [activeSort, setActiveSort] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <PizzaFilterBar 
        isIfoodActive={isIfoodActive} 
        setIsIfoodActive={setIsIfoodActive} 
        activeSort={activeSort} 
        setActiveSort={setActiveSort} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <PizzaGrid 
        isIfoodActive={isIfoodActive} 
        activeSort={activeSort} 
        searchQuery={searchQuery}
      />
    </>
  )
}
