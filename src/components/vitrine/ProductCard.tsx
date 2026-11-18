'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Eye, ShoppingBasket, X } from 'lucide-react';
import { money } from '@/lib/format';
import { useBasket } from './BasketProvider';

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  image_url: string;
  modal_image_url?: string | null;
  price: number;
  link_url?: string | null;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { addToBasket } = useBasket();
  const [added, setAdded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, closeModal]);

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

  return (
    <>
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline/70 bg-white shadow-sm transition hover:shadow-md">
        {/* Product image container (non-clickable) */}
        <div className="relative aspect-square w-full bg-[#f0ece7] overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
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

          {/* Price */}
          <p className="mt-3 font-serif text-lg font-bold text-primary sm:text-xl">
            {money(product.price)}
          </p>

          {/* Actions */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={openModal}
              aria-label={`Ver detalhes de ${product.name}`}
              className="flex items-center justify-center gap-1 rounded-xl border border-outline/70 px-2.5 py-2 text-xs font-semibold text-on-surface/80 transition hover:bg-neutral-50 active:scale-95"
            >
              <Eye size={14} />
              Ver mais
            </button>

            <button
              type="button"
              onClick={handleAdd}
              aria-label={added ? `${product.name} adicionado à cesta` : `Adicionar ${product.name} à cesta`}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition active:scale-95 ${
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

            {/* Modal image */}
            <div className="relative aspect-4/3 w-full bg-[#f0ece7] shrink-0">
              <Image
                src={product.modal_image_url || product.image_url}
                alt={product.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            {/* Modal details */}
            <div className="flex flex-col overflow-y-auto p-6">
              <h2
                id={`modal-title-${product.id}`}
                className="font-serif text-2xl font-bold text-on-surface"
              >
                {product.name}
              </h2>

              <p className="mt-2 font-serif text-xl font-bold text-primary">
                {money(product.price)}
              </p>

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
    </>
  );
}
