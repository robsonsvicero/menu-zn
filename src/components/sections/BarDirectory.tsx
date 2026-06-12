'use client'

import { useState } from 'react'
import BarFilterBar from './BarFilterBar'
import BarGrid from './BarGrid'

export default function BarDirectory() {
  const [isIfoodActive, setIsIfoodActive] = useState(false)
  const [activeSort, setActiveSort] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <BarFilterBar 
        isIfoodActive={isIfoodActive} 
        setIsIfoodActive={setIsIfoodActive} 
        activeSort={activeSort} 
        setActiveSort={setActiveSort} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <BarGrid 
        isIfoodActive={isIfoodActive} 
        activeSort={activeSort} 
        searchQuery={searchQuery}
      />
    </>
  )
}
