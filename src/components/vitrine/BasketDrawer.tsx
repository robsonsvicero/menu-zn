'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, Minus, Plus, ShoppingBasket, X } from 'lucide-react';
import { buildWhatsAppOrderUrl, money } from '@/lib/format';
import { useBasket } from './BasketProvider';

type Props = {
  whatsappNumber: string;
  open?: boolean;
  onClose?: () => void;
};

export default function BasketDrawer({
  whatsappNumber,
  open: propOpen,
  onClose: propClose,
}: Props) {
  const {
    items,
    count,
    subtotal,
    shippingFee,
    total,
    isOpen,
    closeBasket,
    removeFromBasket,
    changeQty,
    clearBasket,
  } = useBasket();

  const open = propOpen ?? isOpen;
  const onClose = propClose ?? closeBasket;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleOrder() {
    const url = buildWhatsAppOrderUrl(whatsappNumber, items, subtotal, shippingFee);
    window.open(url, '_blank', 'noopener,noreferrer');
    clearBasket();
    onClose();
  }

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onMouseDown={onClose}
      />

      {/* Drawer panel */}
      <aside
        aria-label="Sua cesta"
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col rounded-l-[24px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBasket size={20} className="text-[rgb(148,53,21)]" />
            <h2 className="font-serif text-lg font-bold">
              Sua Cesta{' '}
              <span className="text-sm font-normal text-neutral-500">
                ({count} {count === 1 ? 'item' : 'itens'})
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar cesta"
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="text-5xl">🧺</span>
            <p className="text-base font-semibold text-neutral-600">
              Sua cesta está vazia
            </p>
            <p className="text-sm text-neutral-400">
              Adicione produtos para fazer seu pedido via WhatsApp.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-full border border-neutral-200 px-6 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
            >
              Ver produtos
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  {/* Product image */}
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#f0ece7]">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold leading-5">
                        {item.name}
                      </p>
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        aria-label={`Remover ${item.name}`}
                        className="mt-0.5 flex-shrink-0 rounded-full p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <p className="font-serif text-sm font-bold text-[rgb(148,53,21)]">
                      {money(item.price)}
                    </p>

                    {/* Qty controls */}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => changeQty(item.id, item.qty - 1)}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-[rgb(148,53,21)] hover:text-[rgb(148,53,21)]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => changeQty(item.id, item.qty + 1)}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-[rgb(148,53,21)] hover:text-[rgb(148,53,21)]"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="ml-auto text-xs text-neutral-400">
                        {money(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-neutral-100 bg-white px-5 pb-6 pt-4">
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-500">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-800">{money(subtotal)}</span>
              </div>

              <div className="mb-3 flex items-center justify-between text-sm text-neutral-500">
                <span>Frete da vitrine</span>
                <span className="font-medium text-neutral-700">
                  {shippingFee !== null && shippingFee !== undefined
                    ? Number(shippingFee) === 0
                      ? 'Grátis'
                      : money(Number(shippingFee))
                    : 'A combinar'}
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="text-base font-bold text-neutral-800">Total</span>
                <span className="font-serif text-xl font-bold text-[rgb(148,53,21)]">
                  {money(total)}
                </span>
              </div>

              <button
                onClick={handleOrder}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-[#1ebe59] active:scale-[0.98]"
              >
                <MessageCircle size={20} />
                Pedir pelo WhatsApp
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
