import React from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-6 md:px-16 lg:px-24 xl:px-30', className)}>
      {children}
    </div>
  )
}