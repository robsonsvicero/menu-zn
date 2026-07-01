import type { Metadata } from "next";
import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";
import { categoryImages } from "@/lib/category-images";

export const metadata: Metadata = {
  title: "Hamburguerias Zona Norte SP | Menu Zona Norte",
  description:
    "As melhores hamburguerias da Zona Norte de Sao Paulo. Hamburguer artesanal, smash burger e lanches selecionados pelo guia Menu ZN.",
  openGraph: {
    title: "Hamburguerias Zona Norte SP | Menu Zona Norte",
    description:
      "As melhores hamburguerias da Zona Norte de Sao Paulo. Hamburguer artesanal, smash burger e lanches selecionados pelo guia Menu ZN.",
    images: [
      {
        url: categoryImages.hamburguerias,
        width: 1200,
        height: 630,
        alt: "Hamburguerias da Zona Norte de Sao Paulo - Menu Zona Norte",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamburguerias Zona Norte SP | Menu Zona Norte",
    description:
      "Hamburguerias artesanais, smash burgers e lanches selecionados na Zona Norte de Sao Paulo.",
    images: [categoryImages.hamburguerias],
  },
};

export const dynamic = "force-dynamic";

export default async function HamburgueriasPage({
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
      categorySlug="hamburguerias"
      heroTitle="Hamburguerias Artesanais da Zona Norte"
      heroText="Hamburguerias selecionadas pelo Menu ZN: casas autorais, smash burgers e lanches feitos para quem procura sabor, consistencia e boa experiencia."
      heroImage={categoryImages.hamburguerias}
      heroAlt="As melhores hamburguerias da Zona Norte"
      buttonLabel="Explorar Hamburguerias"
      buttonHref="/hamburguerias"
      searchParams={params}
    />
  );
}
