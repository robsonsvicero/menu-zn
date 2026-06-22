import EstablishmentDirectory from "@/components/sections/EstablishmentDirectory";

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
      heroText="Padarias e cafeterias com conteúdo real vindo do Supabase, do balcão clássico às boutiques artesanais."
      heroImage="/images/hero-menuzn.png"
      heroAlt="As Melhores Padarias da Zona Norte"
      buttonLabel="Sentar no Balcão"
      buttonHref="/padarias"
      searchParams={params}
    />
  );
}
