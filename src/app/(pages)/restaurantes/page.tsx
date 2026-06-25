import type { Metadata } from "next";
import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

export const metadata: Metadata = {
  title: "Gastronomia Zona Norte Restaurantes ZN | Menu Zona Norte | SP",
  description:
    "Os melhores restaurantes da Zona Norte de São Paulo. Alta gastronomia de Santana, Tucuruvi e Cantareira no guia editorial Menu ZN.",
  openGraph: {
    title: "Gastronomia Zona Norte Restaurantes ZN | Menu Zona Norte | SP",
    description:
      "Os melhores restaurantes da Zona Norte de São Paulo. Alta gastronomia de Santana, Tucuruvi e Cantareira no guia editorial Menu ZN.",
    images: [
      {
        url: "/images/hero-restaurantes.png",
        width: 1200,
        height: 630,
        alt: "Restaurantes da Zona Norte de São Paulo — Menu Zona Norte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gastronomia Zona Norte Restaurantes ZN | Menu Zona Norte | SP",
    description:
      "Os melhores restaurantes da Zona Norte de São Paulo. Alta gastronomia em Santana, Tucuruvi e Cantareira.",
    images: ["/images/hero-restaurantes.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function RestaurantesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    neighborhood?: string;
    sort?: string;
    ifood?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <EstablishmentDirectory
      categorySlug="restaurantes"
      heroTitle="Os Melhores Restaurantes da Zona Norte"
      heroText="Uma seleção rigorosa e editorial alimentada pelo Supabase, com restaurantes publicados no painel administrativo."
      heroImage="/images/hero-restaurantes.png"
      heroAlt="Os Melhores Restaurantes da Zona Norte"
      buttonLabel="Explorar Guia"
      buttonHref="/restaurantes"
      searchParams={params}
    />
  );
}
