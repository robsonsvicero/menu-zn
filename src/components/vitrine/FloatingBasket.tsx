'use client';

import { ShoppingBasket } from 'lucide-react';
import { useBasket } from './BasketProvider';

type Props = {
  onClick: () => void;
};

export default function FloatingBasket({ onClick }: Props) {
  const { count } = useBasket();

  return (
    <button
      onClick={onClick}
      aria-label={`Abrir cesta, ${count} ${count === 1 ? 'item' : 'itens'}`}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center bg-[rgb(148_53_21)] text-white rounded-full p-4 shadow-xl transition hover:bg-[rgb(130_45_15)] active:scale-95"
    >
      <ShoppingBasket size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-[rgb(148,53,21)] shadow">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
