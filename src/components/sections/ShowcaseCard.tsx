'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, X, ShoppingCart, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { EstablishmentListItem } from '@/lib/establishments-public'

type Props = {
  item: EstablishmentListItem
}

export default function ShowcaseCard({ item }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

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

            {/* Modal image */}
            <div className="relative w-full h-[320px] sm:h-[400px] max-h-[55vh] shrink-0 bg-[#f0ece7] flex items-center justify-center p-3">
              <Image
                src={imageSrc}
                alt={item.name}
                fill
                unoptimized={Boolean(item.image_cover_url)}
                className="object-contain"
              />
            </div>

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
    </>
  )
}
