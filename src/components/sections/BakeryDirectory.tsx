'use client'

import { useState } from 'react'
import BakeryFilterBar from './BakeryFilterBar'
import BakeryGrid from './BakeryGrid'

export default function BakeryDirectory() {
  const [isIfoodActive, setIsIfoodActive] = useState(false)
  const [activeSort, setActiveSort] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <BakeryFilterBar 
        isIfoodActive={isIfoodActive} 
        setIsIfoodActive={setIsIfoodActive} 
        activeSort={activeSort} 
        setActiveSort={setActiveSort} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <BakeryGrid 
        isIfoodActive={isIfoodActive} 
        activeSort={activeSort} 
        searchQuery={searchQuery}
      />
    </>
  )
}
