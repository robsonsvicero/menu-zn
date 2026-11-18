'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { BasketItem } from '@/lib/format';

type BasketContextValue = {
  items: BasketItem[];
  count: number;
  subtotal: number;
  shippingFee: number | null;
  total: number;
  isOpen: boolean;
  openBasket: () => void;
  closeBasket: () => void;
  toggleBasket: () => void;
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

type BasketProviderProps = {
  children: React.ReactNode;
  storefrontId: string;
  shippingFee?: number | null;
};

export default function BasketProvider({
  children,
  storefrontId,
  shippingFee = null,
}: BasketProviderProps) {
  const storageKey = `menu-zn-basket-${storefrontId}`;
  const [items, setItems] = useState<BasketItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const openBasket = useCallback(() => setIsOpen(true), []);
  const closeBasket = useCallback(() => setIsOpen(false), []);
  const toggleBasket = useCallback(() => setIsOpen((prev) => !prev), []);

  // Load from localStorage scoped to this specific storefront
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored) as BasketItem[]);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, hydrated, storageKey]);

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
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const hasShipping = items.length > 0 && shippingFee !== null && shippingFee !== undefined;
  const total = hasShipping ? subtotal + Number(shippingFee) : subtotal;

  return (
    <BasketContext.Provider
      value={{
        items,
        count,
        subtotal,
        shippingFee: shippingFee ?? null,
        total,
        isOpen,
        openBasket,
        closeBasket,
        toggleBasket,
        addToBasket,
        removeFromBasket,
        changeQty,
        clearBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
}
