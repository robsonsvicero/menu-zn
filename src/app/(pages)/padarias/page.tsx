import type { Metadata } from "next";
import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

export const metadata: Metadata = {
  title: "Padarias / Empório Zona Norte ZN | Alta Gastronomia — Menu Zona Norte | SP",
  description:
    "Encontre as melhores padarias, cafeterias e empórios da Zona Norte de São Paulo. Do balcão clássico às boutiques artesanais em Santana e região.",
  openGraph: {
    title: "Padarias / Empório Zona Norte ZN | Alta Gastronomia — Menu Zona Norte | SP",
    description:
      "As melhores padarias, cafeterias e empórios da Zona Norte de São Paulo. Do balcão clássico às boutiques artesanais em Santana e região.",
    images: [
      {
        url: "/images/hero-menuzn.png",
        width: 1200,
        height: 630,
        alt: "Padarias e Empórios da Zona Norte de São Paulo — Menu Zona Norte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Padarias / Empório Zona Norte ZN | Alta Gastronomia — Menu Zona Norte | SP",
    description:
      "As melhores padarias e empórios da Zona Norte de São Paulo. Do balcão clássico às boutiques artesanais.",
    images: ["/images/hero-menuzn.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function PadariasPage({
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
      categorySlug="padarias"
      heroTitle="O Pão Quentinho e o Café Perfeito Estão Aqui"
      heroText="Encontre as melhores padarias, cafeterias e empórios da Zona Norte de São Paulo. Do balcão clássico às boutiques artesanais em Santana e região."
      heroImage="/images/hero-menuzn.png"
      heroAlt="As Melhores Padarias da Zona Norte"
      buttonLabel="Sentar no Balcão"
      buttonHref="/padarias"
      searchParams={params}
    />
  );
}
