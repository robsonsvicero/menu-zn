'use client'

import Image from 'next/image'
import { Globe, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#222222] text-white pt-20 pb-8 px-6 md:px-16 lg:px-[120px]">
      <div className="max-w-[1440px] mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

          {/* Brand & Description */}
          <div className="flex flex-col">
            <div className="mb-6">
              <Image
                src="/logos/logo-vertical 9.png"
                alt="Menu ZN"
                width={120}
                height={80}
                className="object-contain w-auto h-20"
              />
            </div>
            <p className="text-[#a8a8a8] text-sm leading-relaxed mb-8 max-w-xs">
              O guia de alta gastronomia mais completo da Zona Norte de São Paulo. Conectando você aos melhores sabores da região desde 2020.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#a8a8a8] hover:text-white hover:border-white transition-all">
                <Globe size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#a8a8a8] hover:text-white hover:border-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[#a8a8a8] hover:text-white hover:border-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col">
            <h3 className="font-serif text-xl font-bold mb-6">Navegação</h3>
            <div className="flex flex-col gap-4">
              <a href="/" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Home</a>
              <a href="/zona-norte" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Zona Norte</a>
              <a href="/restaurantes" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Restaurantes</a>
              <a href="/bares" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Bares</a>
              <a href="/pizzarias" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Pizzarias</a>
              <a href="/padarias" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Padarias</a>
              <a href="/blog" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Blog</a>
            </div>
          </div>

          {/* For Business */}
          {/* <div className="flex flex-col">
            <h3 className="font-serif text-xl font-bold mb-6">Para Empresas</h3>
            <div className="flex flex-col gap-4">
              <a href="https://w.app/xkvhoo" target="_blank" rel="noopener noreferrer" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Anuncie Aqui</a>
              <a href="/planos" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Planos e Preços</a>
              <a href="/parceiros" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">Seja Parceiro</a>
              <a href="/faq" className="text-[#a8a8a8] hover:text-white text-sm transition-colors">FAQ</a>
            </div>
          </div> */}

          {/* Contact */}
          <div className="flex flex-col">
            <h3 className="font-serif text-xl font-bold mb-6">Contato</h3>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Phone size={18} className="text-[#D69869]" strokeWidth={2} />
                <a href="https://w.app/xkvhoo" target="_blank" rel="noopener noreferrer"><span className="text-[#a8a8a8] text-sm">(11) 97323-7060</span></a>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={18} className="text-[#D69869]" strokeWidth={2} />
                <a href="mailto: menuzonanorte@gmail.com"><span className="text-[#a8a8a8] text-sm">menuzonanorte@gmail.com</span></a>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={18} className="text-[#D69869]" strokeWidth={2} />
                <span className="text-[#a8a8a8] text-sm">Zona Norte, São Paulo - SP</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#a8a8a8] text-[10px] font-bold tracking-[0.15em] uppercase">
            © 2026 Menu Zona Norte. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-8">
            <a href="/privacidade" className="text-[#a8a8a8] hover:text-white text-[10px] font-bold tracking-[0.15em] uppercase transition-colors">
              Privacidade
            </a>
            <a href="/termos" className="text-[#a8a8a8] hover:text-white text-[10px] font-bold tracking-[0.15em] uppercase transition-colors">
              Termos de Uso
            </a>
            <div className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-[#a8a8a8] text-[9px] tracking-wider uppercase">Desenvolvido por</span>
              <a href="https://robsonsvicero.com.br" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/images/logo_robson.png"
                  alt="Robson Svicero"
                  width={80}
                  height={20}
                  className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}
