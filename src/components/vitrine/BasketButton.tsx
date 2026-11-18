'use client';

import { ShoppingBasket } from 'lucide-react';
import { money } from '@/lib/format';
import { useBasket } from './BasketProvider';

export default function BasketButton() {
  const { count, total, openBasket } = useBasket();

  return (
    <button
      type="button"
      onClick={openBasket}
      aria-label={`Abrir cesta, ${count} ${count === 1 ? 'item' : 'itens'}`}
      className="inline-flex items-center gap-2.5 rounded-2xl bg-[rgb(148,53,21)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[rgb(130,45,15)] active:scale-95"
    >
      <div className="relative flex items-center">
        <ShoppingBasket size={18} />
        {count > 0 && (
          <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[rgb(148,53,21)] shadow">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>

      <span>Cesta</span>

      {total > 0 && (
        <span className="rounded-lg bg-black/15 px-2 py-0.5 text-xs font-bold text-white/95">
          {money(total)}
        </span>
      )}
    </button>
  );
}
