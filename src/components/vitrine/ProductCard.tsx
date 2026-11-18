'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Eye, ShoppingBasket, X, ZoomIn, ZoomOut } from 'lucide-react';
import { money } from '@/lib/format';
import { useBasket } from './BasketProvider';

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  image_url: string;
  modal_image_url?: string | null;
  price: number;
  shipping_fee?: number | null;
  link_url?: string | null;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToBasket } = useBasket();
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setLightboxOpen(false);
    setIsZoomed(false);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) {
          setLightboxOpen(false);
          setIsZoomed(false);
        } else {
          closeModal();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, lightboxOpen, closeModal]);

  function handleAdd() {
    addToBasket({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const shortDesc = product.description ? product.description.slice(0, 160) : null;
  const modalImageSrc = product.modal_image_url || product.image_url;

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline/70 bg-white shadow-sm transition hover:shadow-md">
        {/* Product image container (non-clickable) */}
        <div className="relative aspect-square w-full bg-[#f0ece7] overflow-hidden flex items-center justify-center">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 min-h-11 font-serif text-base font-bold leading-5 text-on-surface">
            {product.name}
          </h3>

          {/* Description (max 160 chars) */}
          {shortDesc && (
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-on-surface/70">
              {shortDesc}
            </p>
          )}

          <div className="flex-grow" />

          {/* Price & Shipping */}
          <div className="mt-3">
            <p className="font-serif text-lg font-bold text-primary sm:text-xl">
              {money(product.price)}
            </p>
            <p className="mt-0.5 text-xs font-medium text-on-surface/65">
              {product.shipping_fee !== null && product.shipping_fee !== undefined
                ? Number(product.shipping_fee) === 0
                  ? "Frete grátis"
                  : `Frete: ${money(Number(product.shipping_fee))}`
                : "Frete a combinar"}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={openModal}
              aria-label={`Ver detalhes de ${product.name}`}
              className="flex w-full sm:w-auto items-center justify-center gap-1 rounded-xl border border-outline/70 px-2.5 py-2 text-xs font-semibold text-on-surface/80 transition hover:bg-neutral-50 active:scale-95"
            >
              <Eye size={14} />
              Ver mais
            </button>

            <button
              type="button"
              onClick={handleAdd}
              aria-label={added ? `${product.name} adicionado à cesta` : `Adicionar ${product.name} à cesta`}
              className={`flex w-full sm:flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                added
                  ? 'border border-green-200 bg-green-50 text-green-700'
                  : 'bg-[rgb(148,53,21)] text-white hover:bg-[rgb(130,45,15)]'
              }`}
            >
              {added ? (
                <>✓ Adicionado</>
              ) : (
                <>
                  <ShoppingBasket size={15} />
                  Adicionar à cesta
                </>
              )}
            </button>
          </div>
        </div>
      </article>

      {/* Modal Ver Mais */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${product.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[24px] bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-on-surface shadow-md backdrop-blur-sm transition hover:bg-white"
              aria-label="Fechar modal"
            >
              <X size={18} />
            </button>

            {/* Modal image (clickable for zoom) */}
            <button
              type="button"
              onClick={() => {
                setLightboxOpen(true);
                setIsZoomed(false);
              }}
              title="Clique para ampliar a imagem e ler as informações"
              className="group relative w-full h-[340px] sm:h-[440px] max-h-[58vh] bg-[#f0ece7] shrink-0 flex items-center justify-center p-3 cursor-zoom-in overflow-hidden border-b border-outline/30 text-left focus:outline-none"
            >
              <Image
                src={modalImageSrc}
                alt={product.name}
                fill
                unoptimized
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3.5 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-sm transition group-hover:bg-black group-hover:scale-105">
                <ZoomIn size={15} />
                Clique na imagem para ler
              </span>
            </button>

            {/* Modal details */}
            <div className="flex flex-col overflow-y-auto p-6">
              <h2
                id={`modal-title-${product.id}`}
                className="font-serif text-2xl font-bold text-on-surface"
              >
                {product.name}
              </h2>

              <div>
                <p className="mt-2 font-serif text-xl font-bold text-primary">
                  {money(product.price)}
                </p>
                <p className="mt-0.5 text-xs font-medium text-on-surface/70">
                  {product.shipping_fee !== null && product.shipping_fee !== undefined
                    ? Number(product.shipping_fee) === 0
                      ? "Frete grátis"
                      : `Frete: ${money(Number(product.shipping_fee))}`
                    : "Frete a combinar"}
                </p>
              </div>

              {product.description && (
                <p className="mt-4 text-sm leading-relaxed text-on-surface/80">
                  {product.description}
                </p>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleAdd();
                    closeModal();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[rgb(148,53,21)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[rgb(130,45,15)] active:scale-95"
                >
                  <ShoppingBasket size={18} />
                  Adicionar à cesta
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-outline/70 px-5 py-3 text-sm font-semibold text-on-surface/70 transition hover:bg-neutral-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Imagem Ampliada em Tela Cheia para Leitura */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada para leitura"
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-md"
          onClick={() => {
            setLightboxOpen(false);
            setIsZoomed(false);
          }}
        >
          {/* Top Bar with actions */}
          <div
            className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-serif text-sm font-semibold truncate max-w-[200px] sm:max-w-md">
                {product.name}
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
                  setLightboxOpen(false);
                  setIsZoomed(false);
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
              src={modalImageSrc}
              alt={product.name}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((prev) => !prev);
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
  );
}
