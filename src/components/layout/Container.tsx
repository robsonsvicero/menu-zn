import React from 'react'

type ContainerProps = {
  children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 md:px-16 lg:px-24 xl:px-30">
      {children}
    </div>
  )
}