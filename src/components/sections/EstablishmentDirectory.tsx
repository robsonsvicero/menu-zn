import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Search, Star } from "lucide-react";
import { fetchCategoryFeaturedEstablishments, fetchPublicNeighborhoods, fetchPublishedEstablishments } from "@/lib/establishments-public";

const sortLabels = {
  featured: "Destaques",
  rating: "Melhor avaliados",
  name: "Ordem alfabética",
} as const;

type SearchParams = {
  q?: string;
  neighborhood?: string;
  sort?: string;
  ifood?: string;
};

type EstablishmentDirectoryProps = {
  categorySlug: string;
  heroTitle: string;
  heroText: string;
  heroImage: string;
  heroAlt: string;
  buttonLabel: string;
  buttonHref?: string;
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

export default async function EstablishmentDirectory({
  categorySlug,
  heroTitle,
  heroText,
  heroImage,
  heroAlt,
  buttonLabel,
  buttonHref,
  searchParams,
}: EstablishmentDirectoryProps) {
  const searchTerm = (searchParams?.q ?? "").trim();
  const neighborhoodFilter = (searchParams?.neighborhood ?? "").trim();
  const sortFilter = (searchParams?.sort ?? "featured") as keyof typeof sortLabels;
  const ifoodOnly = searchParams?.ifood === "1" || searchParams?.ifood === "true";

  const [items, neighborhoods, featuredItems] = await Promise.all([
    fetchPublishedEstablishments({
      categorySlug,
      search: searchTerm,
      neighborhoodSlug: neighborhoodFilter,
      ifoodOnly,
      sort: sortFilter === "rating" || sortFilter === "name" ? sortFilter : "featured",
      limit: 24,
    }),
    fetchPublicNeighborhoods(),
    fetchCategoryFeaturedEstablishments(categorySlug),
  ]);

  const categoryName = getRelation(items[0]?.categories)?.name ?? heroTitle;
  const hasResults = items.length > 0;
  const clearHref = buttonHref ?? `/${categorySlug}`;

  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroImage} alt={heroAlt} fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative mx-auto flex min-h-160 max-w-300 items-end px-6 py-20 md:px-10 lg:px-12">
          <div className="max-w-3xl pb-2 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
              {categoryName}
            </span>
            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
              {heroText}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-outline/20 bg-[#faf8f5]/90 backdrop-blur-md md:sticky md:top-0 md:z-30">
        <div className="mx-auto max-w-300 px-6 py-5 md:px-10 lg:px-12">
          <form method="get" className="grid gap-3 rounded-3xl border border-outline/30 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_180px_auto_auto]">
            <label className="relative block">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/45" />
              <input
                type="text"
                name="q"
                defaultValue={searchTerm}
                placeholder="Buscar por nome, endereço ou descrição"
                className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[rgb(148_53_21)]"
              />
            </label>

            <select name="neighborhood" defaultValue={neighborhoodFilter} className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]">
              <option value="">Todos os bairros</option>
              {neighborhoods.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <select name="sort" defaultValue={sortFilter} className="w-full rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm outline-none transition focus:border-[rgb(148_53_21)]">
              <option value="featured">Destaques</option>
              <option value="rating">Melhor avaliados</option>
              <option value="name">Ordem alfabética</option>
            </select>

            <label className="inline-flex items-center gap-2 rounded-2xl border border-outline/40 bg-[#faf8f5] px-4 py-3 text-sm">
              <input type="checkbox" name="ifood" value="1" defaultChecked={ifoodOnly} className="rounded border-outline" />
              iFood
            </label>

            <div className="flex gap-2">
              <button type="submit" className="rounded-2xl bg-[rgb(148_53_21)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90">
                Filtrar
              </button>
              <Link href={clearHref} className="rounded-2xl border border-outline/40 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-on-surface transition hover:bg-[#f3efe8]">
                Limpar
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* ── Category Featured Section ── */}
      {featuredItems.length > 0 && (
        <section className="bg-[rgb(148_53_21)]/5 border-y border-[rgb(148_53_21)]/10">
          <div className="mx-auto max-w-300 px-6 py-14 md:px-10 lg:px-12 lg:py-18">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-block rounded-full border border-[rgb(148_53_21)]/30 bg-[rgb(148_53_21)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[rgb(148_53_21)]">Curadoria</span>
                <h2 className="mt-4 font-serif text-2xl md:text-3xl text-on-surface">Destaque da Categoria</h2>
                <p className="mt-1.5 text-sm text-on-surface/60">Selecionados pelo guia editorial Menu ZN.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {featuredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/local/${item.slug}`}
                  className="group relative overflow-hidden rounded-[28px] shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-3/4 overflow-hidden">
                    <Image
                      src={item.image_cover_url ?? heroImage}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                    <span className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                      {getRelation(item.categories)?.name ?? categoryName}
                    </span>
                    <h3 className="font-serif text-xl leading-tight transition group-hover:text-[rgb(255_180_120)]">
                      {item.name}
                    </h3>
                    {item.rating !== null && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold">{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-white/70">
                      <MapPin size={12} className="shrink-0" />
                      <span>{getRelation(item.neighborhoods)?.name ?? ""}</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/80 group-hover:text-white transition">
                      Ver detalhes <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-300 px-6 py-14 md:px-10 lg:px-12 lg:py-18">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl capitalize">{categoryName || "Estabelecimentos"}</h2>
            <p className="mt-1 text-sm text-on-surface/65">
              {items.length} estabelecimento{items.length === 1 ? "" : "s"} encontrado{items.length === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.18em] text-on-surface/55">
            Ordenação atual: {sortLabels[sortFilter as keyof typeof sortLabels] ?? sortLabels.featured}
          </div>
        </div>

        {hasResults ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Link key={item.id} href={`/local/${item.slug}`} className="group overflow-hidden rounded-[28px] border border-outline/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image src={item.image_cover_url ?? heroImage} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
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
                        {getRelation(item.categories)?.name ?? categoryName}
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
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-outline/30 bg-white p-10 text-center shadow-sm">
            <h3 className="font-serif text-2xl text-on-surface">Nenhum estabelecimento encontrado</h3>
            <p className="mt-3 text-sm leading-7 text-on-surface/65">
              Ajuste a busca, mude o bairro ou remova o filtro de iFood para encontrar resultados.
            </p>
            <div className="mt-6">
              <Link href={clearHref} className="rounded-full bg-[rgb(148_53_21)] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:opacity-90">
                Limpar filtros
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
