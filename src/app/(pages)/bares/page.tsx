import type { Metadata } from "next";
import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

export const metadata: Metadata = {
  title: "Bares / Pub Zona Norte ZN | Alta Gastronomia — Menu Zona Norte | SP",
  description:
    "Descubra os melhores bares e pubs da Zona Norte de São Paulo. Do boteco raiz à alta coquetelaria em Santana, Tucuruvi e região.",
  openGraph: {
    title: "Bares / Pub Zona Norte ZN | Alta Gastronomia — Menu Zona Norte | SP",
    description:
      "Descubra os melhores bares e pubs da Zona Norte de São Paulo. Do boteco raiz à alta coquetelaria em Santana, Tucuruvi e região.",
    images: [
      {
        url: "/images/hero-menuzn.png",
        width: 1200,
        height: 630,
        alt: "Bares e Pubs da Zona Norte de São Paulo — Menu Zona Norte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bares / Pub Zona Norte ZN | Alta Gastronomia — Menu Zona Norte | SP",
    description:
      "Os melhores bares e pubs da Zona Norte de São Paulo. Alta coquetelaria em Santana e Tucuruvi.",
    images: ["/images/hero-menuzn.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function BaresPage({
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
      categorySlug="bares"
      heroTitle="A Vida Noturna da Zona Norte em Foco"
      heroText="Descubra os melhores bares e pubs da Zona Norte de São Paulo. Do boteco raiz à alta coquetelaria em Santana, Tucuruvi e região."
      heroImage="/images/hero-menuzn.png"
      heroAlt="Os Melhores Bares da Zona Norte"
      buttonLabel="Descobrir Bares"
      buttonHref="/bares"
      searchParams={params}
    />
  );
}
