'use client'
import Container from "./Container";
import { Menu } from 'lucide-react'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-[rgba(250,248,242,0.15)] backdrop-blur-[8px]">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
              <Menu size={16} className="text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-white">Menu ZN</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-secondary' : 'text-white/80 hover:text-white'}`}>Home</a>
            <a href="/restaurantes" className={`text-sm font-medium transition-colors ${pathname === '/restaurantes' ? 'text-secondary' : 'text-white/80 hover:text-white'}`}>Restaurantes</a>
            <a href="/bares" className={`text-sm font-medium transition-colors ${pathname === '/bares' ? 'text-secondary' : 'text-white/80 hover:text-white'}`}>Bares</a>
            <a href="/pizzarias" className={`text-sm font-medium transition-colors ${pathname === '/pizzarias' ? 'text-secondary' : 'text-white/80 hover:text-white'}`}>Pizzarias</a>
            <a href="/padarias" className={`text-sm font-medium transition-colors ${pathname === '/padarias' ? 'text-secondary' : 'text-white/80 hover:text-white'}`}>Padarias</a>
            <a href="/blog" className={`text-sm font-medium transition-colors ${pathname === '/blog' ? 'text-secondary' : 'text-white/80 hover:text-white'}`}>Blog</a>
          </nav>

          {/* CTA */}
          <Button
            variant="default"
            size="lg"
            className="w-[180px] rounded-full px-6"
          >
            Anuncie
          </Button>
        </div>
      </Container>
    </header>
  )
}