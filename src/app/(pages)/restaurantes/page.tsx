import type { Metadata } from "next";
import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";
import { categoryImages } from "@/lib/category-images";

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
        url: categoryImages.restaurantes,
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
    images: [categoryImages.restaurantes],
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
      heroText="Restaurantes selecionados por sua qualidade e sabor para quem busca boas experiências gastronômicas na Zona Norte de São Paulo."
      heroImage={categoryImages.restaurantes}
      heroAlt="Os Melhores Restaurantes da Zona Norte"
      buttonLabel="Explorar Guia"
      buttonHref="/restaurantes"
      searchParams={params}
    />
  );
}
