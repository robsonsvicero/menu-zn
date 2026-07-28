"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "menu-zn-plans-popup-seen";

export default function PlansPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) !== "1") {
      window.localStorage.setItem(STORAGE_KEY, "1");
      const timer = window.setTimeout(() => setIsOpen(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plans-popup-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md rounded-[28px] bg-[#faf8f5] p-8 text-center shadow-2xl md:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-full p-2 text-on-surface/60 transition-colors hover:bg-black/5 hover:text-on-surface"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <span className="inline-block rounded-full bg-[rgb(148_53_21)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[rgb(148_53_21)]">
          Para estabelecimentos
        </span>
        <h2 id="plans-popup-title" className="mt-5 font-serif text-3xl font-bold text-on-surface">
          Quer aparecer no Menu Zona Norte?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-on-surface/70">
          Divulgue seu estabelecimento para um público que busca as melhores experiências gastronômicas da região.
        </p>
        <Link
          href="/planos"
          onClick={dismiss}
          className="mt-7 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[rgb(148_53_21)] px-6 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[rgb(148_53_21)]/20 transition-colors hover:bg-[rgb(148_53_21)]/90"
        >
          Conhecer os planos
        </Link>
      </div>
    </div>
  );
}
