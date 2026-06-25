import type { Metadata } from "next";
import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

export const metadata: Metadata = {
  title: "Pizzarias ZN | Alta Gastronomia Zona Norte — Menu Zona Norte | SP",
  description:
    "As melhores pizzarias da Zona Norte de São Paulo. Cantinas tradicionais e pizzas napolitanas autorais em Santana, Tucuruvi e região.",
  openGraph: {
    title: "Pizzarias ZN | Alta Gastronomia Zona Norte — Menu Zona Norte | SP",
    description:
      "As melhores pizzarias da Zona Norte de São Paulo. Cantinas tradicionais e pizzas napolitanas autorais em Santana e região.",
    images: [
      {
        url: "/images/hero-menuzn.png",
        width: 1200,
        height: 630,
        alt: "Pizzarias da Zona Norte de São Paulo — Menu Zona Norte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizzarias ZN | Alta Gastronomia Zona Norte — Menu Zona Norte | SP",
    description:
      "As melhores pizzarias da Zona Norte de São Paulo. Cantinas tradicionais e pizzas napolitanas em Santana e região.",
    images: ["/images/hero-menuzn.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function PizzariasPage({
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
      categorySlug="pizzarias"
      heroTitle="A Verdadeira Pizza Paulistana Mora Aqui"
      heroText="Cantinas tradicionais e pizzarias napolitanas com dados reais do painel administrativo."
      heroImage="/images/hero-restaurantes.png"
      heroAlt="As Melhores Pizzarias da Zona Norte"
      buttonLabel="Escolher Fatias"
      buttonHref="/pizzarias"
      searchParams={params}
    />
  );
}
