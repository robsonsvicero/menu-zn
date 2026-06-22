import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

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
      heroText="Do boteco raiz ao gastrobars com alta coquetelaria, em uma vitrine real alimentada pelo Supabase."
      heroImage="/images/hero-menuzn.png"
      heroAlt="Os Melhores Bares da Zona Norte"
      buttonLabel="Descobrir Bares"
      buttonHref="/bares"
      searchParams={params}
    />
  );
}
