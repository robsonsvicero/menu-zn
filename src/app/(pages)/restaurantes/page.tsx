import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

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
