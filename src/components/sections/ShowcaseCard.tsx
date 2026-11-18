'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, X, ShoppingCart, Info, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { EstablishmentListItem } from '@/lib/establishments-public'

type Props = {
  item: EstablishmentListItem
}

export default function ShowcaseCard({ item }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => {
    setModalOpen(false)
    setLightboxOpen(false)
    setIsZoomed(false)
  }, [])

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false)
          setIsZoomed(false)
        } else {
          closeModal()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, lightboxOpen, closeModal])

  const imageSrc = item.image_cover_url || '/images/hero-restaurantes.png'

  const description = item.short_description
    ? item.short_description.slice(0, 160)
    : null

  const whatsappHref = item.whatsapp
    ? `https://wa.me/${item.whatsapp.replace(/\D/g, '')}`
    : item.phone
    ? `tel:${item.phone}`
    : null

  return (
    <>
      {/* Card */}
      <div className="flex flex-col bg-surface rounded-[20px] overflow-hidden border border-outline/40 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Image Container */}
        <div className="relative w-full h-[220px] overflow-hidden bg-[#f0ece7] flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={Boolean(item.image_cover_url)}
            className="object-contain p-2 transition-transform duration-300 hover:scale-105"
          />

          {/* Neighborhood Badge */}
          {item.neighborhoods?.[0]?.name && (
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-[9px] font-bold text-on-surface tracking-wider uppercase">
                {item.neighborhoods[0].name}
              </span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-4">
            {item.categories?.[0]?.name ? (
              <div className="bg-gray-100 px-2 py-1 rounded">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {item.categories[0].name}
                </span>
              </div>
            ) : <div />}

            {item.rating !== null && (
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-[#F5A623] fill-current" />
                <span className="text-on-surface font-bold text-sm">{item.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-[22px] leading-snug text-on-surface font-bold mb-2">
            {item.name}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-on-surface/65 leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
          )}

          <div className="flex-grow" />

          {/* Footer */}
          <div className="border-t border-outline/40 pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold tracking-widest text-on-surface uppercase">
                MENU ZONA NORTE
              </span>
              {item.price_range && (
                <span className="text-primary font-bold text-xs tracking-wider">
                  {item.price_range}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Comprar button — WhatsApp / phone / fallback to page */}
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="sm" className="w-full gap-1.5 text-[10px] tracking-widest">
                    <ShoppingCart size={13} />
                    Comprar
                  </Button>
                </a>
              ) : (
                <Link href={`/local/${item.slug}`} className="flex-1">
                  <Button size="sm" className="w-full gap-1.5 text-[10px] tracking-widest">
                    <ShoppingCart size={13} />
                    Comprar
                  </Button>
                </Link>
              )}

              {/* Ver mais button */}
              <Button
                size="sm"
                variant="outline"
                onClick={openModal}
                className="flex-1 gap-1.5 text-[10px] tracking-widest"
              >
                <Info size={13} />
                Ver mais
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-surface rounded-[24px] overflow-hidden shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors"
              aria-label="Fechar"
            >
              <X size={18} className="text-on-surface" />
            </button>

            {/* Modal image (clickable for zoom) */}
            <button
              type="button"
              onClick={() => {
                setLightboxOpen(true)
                setIsZoomed(false)
              }}
              title="Clique para ampliar a imagem e ler as informações"
              className="group relative w-full h-[320px] sm:h-[400px] max-h-[55vh] shrink-0 bg-[#f0ece7] flex items-center justify-center p-3 cursor-zoom-in overflow-hidden border-b border-outline/30 text-left focus:outline-none"
            >
              <Image
                src={imageSrc}
                alt={item.name}
                fill
                unoptimized={Boolean(item.image_cover_url)}
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm transition group-hover:bg-black group-hover:scale-105">
                <ZoomIn size={15} />
                Clique na imagem para ler
              </span>
            </button>

            {/* Modal content */}
            <div className="p-6 overflow-y-auto">
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-3">
                {item.categories?.[0]?.name && (
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    {item.categories[0].name}
                  </span>
                )}
                {item.rating !== null && (
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="text-[#F5A623] fill-current" />
                    <span className="font-bold text-sm text-on-surface">{item.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <h2 className="font-serif text-2xl text-on-surface font-bold mb-3">
                {item.name}
              </h2>

              {item.short_description && (
                <p className="text-sm text-on-surface/70 leading-relaxed mb-4">
                  {item.short_description}
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap gap-3 mb-5 text-[11px] text-on-surface/60 uppercase tracking-wider">
                {item.neighborhoods?.[0]?.name && (
                  <span>📍 {item.neighborhoods[0].name}</span>
                )}
                {item.price_range && (
                  <span>💰 {item.price_range}</span>
                )}
                {item.has_ifood && (
                  <span className="text-[rgb(148_53_21)] font-bold">iFood</span>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3">
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full gap-2 text-xs tracking-widest">
                      <ShoppingCart size={14} />
                      Comprar
                    </Button>
                  </a>
                ) : null}
                <Link href={`/local/${item.slug}`} className="flex-1">
                  <Button variant="outline" className="w-full text-xs tracking-widest">
                    Ver página completa
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Imagem Ampliada para Leitura */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada para leitura"
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-md"
          onClick={() => {
            setLightboxOpen(false)
            setIsZoomed(false)
          }}
        >
          {/* Top Bar with actions */}
          <div
            className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-serif text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
                {item.name}
              </span>
              <span className="hidden sm:inline text-xs text-white/50">
                • {isZoomed ? "Modo leitura (rolagem ativa)" : "Ajustado à tela"}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom toggle button */}
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 active:scale-95"
              >
                {isZoomed ? (
                  <>
                    <ZoomOut size={15} />
                    <span>Ajustar à tela</span>
                  </>
                ) : (
                  <>
                    <ZoomIn size={15} />
                    <span>Ampliar texto (100%)</span>
                  </>
                )}
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false)
                  setIsZoomed(false)
                }}
                className="rounded-xl bg-white/15 p-1.5 text-white transition hover:bg-white/25"
                aria-label="Fechar ampliação"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Image container: scrollable when zoomed, centered when fitted */}
          <div
            className={`flex-1 w-full overflow-y-auto overflow-x-hidden p-3 sm:p-6 flex justify-center ${
              isZoomed ? "items-start cursor-zoom-out" : "items-center cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed((prev) => !prev)}
          >
            {/* Native img to respect natural aspect ratio and allow vertical scrolling */}
            <img
              src={imageSrc}
              alt={item.name}
              onClick={(e) => {
                e.stopPropagation()
                setIsZoomed((prev) => !prev)
              }}
              className={`rounded-xl shadow-2xl transition-all duration-200 select-none ${
                isZoomed
                  ? "w-full max-w-[95vw] md:max-w-[950px] h-auto cursor-zoom-out my-auto"
                  : "max-h-[85vh] max-w-[92vw] w-auto h-auto object-contain cursor-zoom-in"
              }`}
            />
          </div>

          {/* Bottom helper text */}
          <div
            className="py-2.5 text-center text-xs text-white/60 shrink-0 border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {isZoomed
              ? "Role para cima e para baixo para ler todo o conteúdo • Clique na imagem para ajustar à tela"
              : "Clique na imagem ou em 'Ampliar texto' para ler em tamanho real • ESC para fechar"}
          </div>
        </div>
      )}
    </>
  )
}
