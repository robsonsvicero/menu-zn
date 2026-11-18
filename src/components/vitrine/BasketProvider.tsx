'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { BasketItem } from '@/lib/format';

const STORAGE_KEY = 'menu-zn-basket';

type BasketContextValue = {
  items: BasketItem[];
  count: number;
  total: number;
  addToBasket: (item: Omit<BasketItem, 'qty'>) => void;
  removeFromBasket: (id: string) => void;
  changeQty: (id: string, qty: number) => void;
  clearBasket: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

export function useBasket(): BasketContextValue {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used within BasketProvider');
  return ctx;
}

export default function BasketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as BasketItem[]);
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addToBasket = useCallback((item: Omit<BasketItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const removeFromBasket = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const changeQty = useCallback((id: string, qty: number) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty } : i)),
      );
    }
  }, []);

  const clearBasket = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <BasketContext.Provider
      value={{ items, count, total, addToBasket, removeFromBasket, changeQty, clearBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}
