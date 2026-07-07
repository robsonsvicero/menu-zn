import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import {
  fetchPublicCategories,
  fetchPublicNeighborhoods,
  fetchPublishedEstablishmentsCount,
  fetchPublishedEstablishments,
} from "@/lib/establishments-public";
import ShowcaseFilterForm from "./ShowcaseFilterForm";

const sortLabels = {
  featured: "Destaques",
  rating: "Melhor avaliados",
  name: "Ordem alfabética",
} as const;

type SearchParams = {
  q?: string;
  neighborhood?: string;
  category?: string;
  sort?: string;
  ifood?: string;
};

type EstablishmentShowcaseProps = {
  searchParams?: SearchParams;
};

function formatRating(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "Sem avaliação";
  }

  return value.toFixed(1);
}

function formatPriceRange(value: string | null) {
  return value || "Sob consulta";
}

function formatPhone(value: string | null) {
  if (!value) return "Sem telefone";

  const digits = value.replace(/\D/g, "");
  if (!digits) return "Sem telefone";

  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 10) {
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
}

function getRelation<T>(relation: T | T[] | null | undefined): T | null {
  if (!relation) return null;
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation as T;
}

export default async function EstablishmentShowcase({ searchParams }: EstablishmentShowcaseProps) {
  const searchTerm = (searchParams?.q ?? "").trim();
  const neighborhoodFilter = (searchParams?.neighborhood ?? "").trim();
  const categoryFilter = (searchParams?.category ?? "").trim();
  const sortFilter = (searchParams?.sort ?? "featured") as keyof typeof sortLabels;
  const ifoodOnly = searchParams?.ifood === "1" || searchParams?.ifood === "true";

  const [items, totalCount, neighborhoods, categories] = await Promise.all([
    fetchPublishedEstablishments({
      categorySlug: categoryFilter || undefined,
      search: searchTerm,
      neighborhoodSlug: neighborhoodFilter,
      ifoodOnly,
      sort: sortFilter === "rating" || sortFilter === "name" ? sortFilter : "featured",
      limit: 30,
    }),
    fetchPublishedEstablishmentsCount({
      categorySlug: categoryFilter || undefined,
      search: searchTerm,
      neighborhoodSlug: neighborhoodFilter,
      ifoodOnly,
    }),
    fetchPublicNeighborhoods(),
    fetchPublicCategories(),
  ]);

  const hasResults = items.length > 0;

  return (
    <div className="bg-[#faf8f5]" id="vitrine">
      {/* Filters Bar */}
      <section className="sticky top-0 z-30 border-y border-outline/20 bg-[#faf8f5]/90 backdrop-blur-md">
        <div className="mx-auto max-w-300 px-6 py-5 md:px-10 lg:px-12">
          <ShowcaseFilterForm
            searchTerm={searchTerm}
            neighborhoodFilter={neighborhoodFilter}
            categoryFilter={categoryFilter}
            sortFilter={sortFilter}
            ifoodOnly={ifoodOnly}
            neighborhoods={neighborhoods}
            categories={categories}
          />
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-300 px-6 py-14 md:px-10 lg:px-12 lg:py-18">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Vitrine de Estabelecimentos</h2>
            <p className="mt-1 text-sm text-on-surface/65">
              {totalCount} estabelecimento{totalCount === 1 ? "" : "s"} encontrado{totalCount === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.18em] text-on-surface/55">
            Ordenação: {sortLabels[sortFilter as keyof typeof sortLabels] ?? sortLabels.featured}
          </div>
        </div>

        {hasResults ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const categoryName = getRelation(item.categories)?.name ?? "Estabelecimento";
              const fallbackImage = "/images/hero-zonanorte.png";
              return (
                <Link
                  key={item.id}
                  href={`/local/${item.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-outline/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={item.image_cover_url ?? fallbackImage}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-transparent" />
                    {item.has_ifood ? (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[rgb(148_53_21)]">
                        iFood
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[rgb(148_53_21)]">
                          {categoryName}
                        </p>
                        <h3 className="mt-2 font-serif text-2xl leading-tight text-on-surface transition group-hover:text-[rgb(148_53_21)]">
                          {item.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-[#faf3ee] px-3 py-1 text-xs font-semibold text-[rgb(148_53_21)]">
                        <Star size={12} />
                        {formatRating(item.rating)}
                      </div>
                    </div>

                    <p className="line-clamp-3 text-sm leading-7 text-on-surface/70">
                      {item.short_description ?? "Estabelecimento publicado pelo painel administrativo do Menu ZN."}
                    </p>

                    <div className="space-y-2 text-xs text-on-surface/65">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="shrink-0" />
                        <span>{getRelation(item.neighborhoods)?.name ?? "Bairro não informado"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="shrink-0" />
                        <span>{formatPhone(item.phone)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 text-xs uppercase tracking-[0.18em] text-on-surface/55">
                      <span>{formatPriceRange(item.price_range)}</span>
                      <span className="inline-flex items-center gap-2 text-[rgb(148_53_21)]">
                        Ver detalhes
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[28px] border border-outline/30 bg-white p-10 text-center shadow-sm">
            <h3 className="font-serif text-2xl text-on-surface">Nenhum estabelecimento encontrado</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface/65">
              Ajuste a busca, mude o bairro, a categoria ou remova o filtro de iFood para encontrar resultados.
            </p>
            <div className="mt-6">
              <a
                href="/zona-norte#vitrine"
                className="inline-block rounded-full bg-[rgb(148_53_21)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
              >
                Limpar filtros
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
