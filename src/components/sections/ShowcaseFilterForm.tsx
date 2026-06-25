"use client";

import { useRef } from "react";
import { Search } from "lucide-react";

type FilterOption = { slug: string; name: string };

type ShowcaseFilterFormProps = {
  searchTerm: string;
  neighborhoodFilter: string;
  categoryFilter: string;
  sortFilter: string;
  ifoodOnly: boolean;
  neighborhoods: FilterOption[];
  categories: FilterOption[];
};

export default function ShowcaseFilterForm({
  searchTerm,
  neighborhoodFilter,
  categoryFilter,
  sortFilter,
  ifoodOnly,
  neighborhoods,
  categories,
}: ShowcaseFilterFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    const params = new URLSearchParams();
    const data = new FormData(formRef.current);
    data.forEach((value, key) => {
      if (value) params.set(key, value.toString());
    });
    window.location.href = `/zona-norte?${params.toString()}#vitrine`;
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-3xl border border-outline/30 bg-white p-4 shadow-sm md:grid-cols-[1fr_200px_180px_160px_auto_auto]"
    >
      {/* Busca */}
      <label className="relative block">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/45" />
        <input
          type="text"
          name="q"
          defaultValue={searchTerm}
          placeholder="Buscar estabelecimento…"
          className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
        />
      </label>

      {/* Categorias */}
      <select
        name="category"
        defaultValue={categoryFilter}
        className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
      >
        <option value="">Todas as categorias</option>
        {categories.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Bairros */}
      <select
        name="neighborhood"
        defaultValue={neighborhoodFilter}
        className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
      >
        <option value="">Todos os bairros</option>
        {neighborhoods.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Ordenação */}
      <select
        name="sort"
        defaultValue={sortFilter}
        className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
      >
        <option value="featured">Destaques</option>
        <option value="rating">Melhor avaliados</option>
        <option value="name">Ordem alfabética</option>
      </select>

      {/* iFood */}
      <label className="inline-flex items-center gap-2 rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm">
        <input
          type="checkbox"
          name="ifood"
          value="1"
          defaultChecked={ifoodOnly}
          className="rounded border-outline"
        />
        iFood
      </label>

      {/* Ações */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-2xl bg-[rgb(148_53_21)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
        >
          Filtrar
        </button>
        <a
          href="/zona-norte#vitrine"
          className="rounded-2xl border border-outline/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-surface transition hover:bg-[#f3efe8]"
        >
          Limpar
        </a>
      </div>
    </form>
  );
}
