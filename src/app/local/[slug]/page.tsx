import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, DollarSign, MapPin, Phone, Star, Globe, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { fetchPublishedEstablishmentBySlug, fetchPublishedEstablishments } from "@/lib/establishments-public";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatRating(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "Sem avaliação";
  }

  return value.toFixed(1);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const establishment = await fetchPublishedEstablishmentBySlug(slug);

  if (!establishment) {
    return { title: "Estabelecimento não encontrado | Menu ZN" };
  }

  return {
    title: `${establishment.name} | Menu ZN`,
    description: establishment.short_description ?? establishment.description ?? undefined,
  };
}

export default async function LocalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const establishment = await fetchPublishedEstablishmentBySlug(slug);

  if (!establishment) {
    notFound();
  }

  const categorySlug = establishment.categories?.[0]?.slug ?? "restaurantes";
  const related = (await fetchPublishedEstablishments({
    categorySlug,
    limit: 4,
    sort: "featured",
  })).filter((item) => item.slug !== establishment.slug);

  const imageSrc = establishment.image_cover_url ?? "/images/hero-restaurantes.png";

  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={imageSrc} alt={establishment.name} fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative mx-auto flex min-h-160 max-w-300 flex-col justify-between px-6 py-20 md:px-10 lg:px-12">
          <Link href={`/${categorySlug}`} className="inline-flex w-fit items-center gap-2 rounded-full text-white border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur-sm transition hover:bg-white/20">
            <ArrowLeft size={14} />
            Voltar para a categoria
          </Link>

          <div className="max-w-4xl text-white">
            <span className="inline-flex rounded-full bg-[rgb(148_53_21)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
              {establishment.categories?.[0]?.name ?? "Estabelecimento"}
            </span>

            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              {establishment.name}
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/85 md:text-base">
              {establishment.short_description ?? establishment.description ?? "Estabelecimento publicado pelo painel administrativo do Menu ZN."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <MapPin size={16} />
                {establishment.neighborhoods?.[0]?.name ?? "Bairro não informado"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Star size={16} />
                {formatRating(establishment.rating)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                {establishment.price_range ? (
                  <>
                    <DollarSign size={16} />
                    {establishment.price_range}
                  </>
                ) : (
                  <>
                    <DollarSign size={16} />
                    Sob consulta
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-300 px-6 py-14 md:px-10 lg:px-12 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <article className="rounded-[28px] border border-outline/20 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl">Sobre o local</h2>
              <p className="mt-4 text-[17px] leading-8 text-on-surface/90 whitespace-pre-line">
                {establishment.description ?? establishment.short_description ?? "Conteúdo em atualização."}
              </p>
            </article>

            <article className="rounded-[28px] border border-outline/20 bg-white p-8 shadow-sm">
              <h2 className="font-serif text-2xl">Galeria e contato</h2>
              <div className="mt-5 grid gap-6 md:grid-cols-2">
                <div className="relative aspect-4/3 overflow-hidden rounded-3xl">
                  <Image src={imageSrc} alt={establishment.name} fill className="object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-on-surface/75">
                    <MapPin size={16} />
                    <span>{establishment.address ?? "Endereço não informado"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-on-surface/75">
                    <Phone size={16} />
                    <span>{establishment.phone ?? "Telefone não informado"}</span>
                  </div>
                  {establishment.price_range && (
                    <div className="flex items-center gap-3 text-sm text-on-surface/75">
                      <DollarSign size={16} />
                      <span>Faixa de preço: {establishment.price_range}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    {establishment.website_url ? (
                      <a href={establishment.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-outline/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-[#f3efe8]">
                        <Globe size={14} />
                        Site
                      </a>
                    ) : null}
                    {establishment.instagram_url ? (
                      <a href={establishment.instagram_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-outline/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-[#f3efe8]">
                        <Globe size={14} />
                        Instagram
                      </a>
                    ) : null}
                    {establishment.whatsapp ? (
                      <a href={`https://wa.me/${establishment.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-outline/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition hover:bg-[#f3efe8]">
                        <MessageCircle size={14} />
                        WhatsApp
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-outline/20 bg-white p-8 shadow-sm">
              <h3 className="font-serif text-2xl">Resumo</h3>
              <dl className="mt-5 space-y-4 text-sm text-on-surface/75">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-on-surface/55">Categoria</dt>
                  <dd className="font-medium">{establishment.categories?.[0]?.name ?? "-"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-on-surface/55">Bairro</dt>
                  <dd className="font-medium">{establishment.neighborhoods?.[0]?.name ?? "-"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-on-surface/55">Avaliação</dt>
                  <dd className="font-medium">{formatRating(establishment.rating)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-on-surface/55">iFood</dt>
                  <dd className="font-medium">{establishment.has_ifood ? "Sim" : "Não"}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-[#f6f2eb] py-16 md:py-20">
          <div className="mx-auto max-w-300 px-6 md:px-10 lg:px-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl">Mais da mesma categoria</h2>
                <p className="mt-1 text-sm text-on-surface/65">Outros locais publicados no painel administrativo.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/local/${item.slug}`} className="group overflow-hidden rounded-[26px] border border-outline/20 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image src={item.image_cover_url ?? imageSrc} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-3 p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[rgb(148_53_21)]">
                      {item.categories?.[0]?.name ?? "Estabelecimento"}
                    </p>
                    <h3 className="font-serif text-xl leading-snug text-on-surface transition group-hover:text-[rgb(148_53_21)]">
                      {item.name}
                    </h3>
                    <p className="text-sm leading-7 text-on-surface/70 line-clamp-3">
                      {item.short_description ?? "Conteúdo do Menu ZN."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
