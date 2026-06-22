import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

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
