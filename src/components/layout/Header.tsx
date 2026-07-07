'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X } from 'lucide-react'
import Image from 'next/image'
import Container from './Container'
import { Button } from '../ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/zona-norte', label: 'Zona Norte' },
  { href: '/restaurantes', label: 'Restaurantes' },
  { href: '/bares', label: 'Bares' },
  { href: '/pizzarias', label: 'Pizzarias' },
  { href: '/padarias', label: 'Padarias' },
  { href: '/hamburguerias', label: 'Hamburguerias' },
  { href: '/blog', label: 'Blog' },
]

// Hotdog icon: middle line full-width, top and bottom lines shorter
function HotdogIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Top line — shorter */}
      <line x1="3" y1="2" x2="21" y2="2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Middle line — full width */}
      <line x1="0" y1="8" x2="24" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bottom line — shorter */}
      <line x1="3" y1="14" x2="21" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Prevent body scroll while menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-[rgba(250,248,242,0.15)] backdrop-blur-[8px]">
        <Container className="mx-0">
          <div className="flex h-20 items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logos/logo-horizontal 6.png"
                alt="Menu ZN"
                width={140}
                height={40}
                className="object-contain h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-6 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-secondary' : 'text-white/80 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA & Admin */}
            <div className="hidden lg:flex items-center gap-4">
              {/* <a
                href="/admin/login"
                className="text-white/80 hover:text-white transition-colors pr-8"
                aria-label="Admin"
              >
                <Settings size={20} />
              </a> */}
              <a href="https://w.app/xkvhoo" target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="lg" className="w-[180px] px-6 tracking-[0.9px]">
                  Anuncie
                </Button>
              </a>
            </div>

            {/* Mobile: Hotdog button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center text-white"
              aria-label="Abrir menu"
            >
              <HotdogIcon size={22} className="text-white" />
            </button>

          </div>
        </Container>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 left-0 h-full w-full  bg-background flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-8 h-20 border-b border-outline/40">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Image
                src="/logos/logo-horizontal 4.png"
                alt="Menu ZN"
                width={120}
                height={36}
                className="object-contain h-9 w-auto"
              />
            </Link>
            <div className="flex items-center gap-2">
              {/* <a
                href="/admin/login"
                className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
                aria-label="Admin"
              >
                <Settings size={22} />
              </a> */}
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
                aria-label="Fechar menu"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Drawer Nav Links */}
          <nav className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-5 border-b border-outline/30 font-serif text-[28px] font-bold transition-colors ${pathname === link.href
                    ? 'text-secondary'
                    : 'text-on-surface hover:text-secondary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Drawer CTA */}
          <div className="px-8 pb-10">
            <a href="https://w.app/xkvhoo" target="_blank" rel="noopener noreferrer" className="block">
              <button className="w-full bg-primary hover:bg-[#7a2a10] text-white font-serif text-lg font-bold py-5 rounded-2xl transition-colors">
                Anuncie
              </button>
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
