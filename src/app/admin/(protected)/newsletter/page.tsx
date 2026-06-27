import { createClient } from "@/lib/supabase/server";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { Mail } from "lucide-react";
import NewsletterExportButton from "@/components/admin/NewsletterExportButton";
import NewsletterDeleteButton from "@/components/admin/NewsletterDeleteButton";

export const dynamic = "force-dynamic";

type SubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};

type SearchParams = {
  sort?: string;
  dir?: string;
  q?: string;
};

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentSort = params.sort ?? "created_at";
  const currentDir = params.dir ?? "desc";
  const searchQuery = params.q ?? "";

  let query = supabase
    .from("newsletter_subscribers")
    .select("id, email, created_at")
    .limit(500);

  if (searchQuery) {
    query = query.ilike("email", `%${searchQuery}%`);
  }

  query = query.order(currentSort as string, {
    ascending: currentDir === "asc",
    nullsFirst: false,
  });

  const { data, error } = await query;

  const subscribers = (data ?? []) as SubscriberRow[];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif flex items-center gap-3">
            <Mail size={28} className="text-primary" />
            Newsletter
          </h2>
          <p className="text-sm text-on-surface/70 mt-1">
            {subscribers.length} inscrito{subscribers.length !== 1 ? "s" : ""} na newsletter.
          </p>
        </div>

        <NewsletterExportButton className="text-[#222222]" />
      </div>

      {/* Search */}
      <form method="get" className="mb-4">
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Buscar por e-mail..."
            className="flex-1 rounded-xl border border-outline bg-white px-4 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Buscar
          </button>
          {searchQuery && (
            <a
              href="/admin/newsletter"
              className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background transition-colors"
            >
              Limpar
            </a>
          )}
        </div>
      </form>

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar inscritos: {error.message}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <th className="px-4 py-3 text-left font-medium w-12">#</th>
              <SortableHeader
                label="E-mail"
                column="email"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/newsletter"
              />
              <SortableHeader
                label="Data de inscrição"
                column="created_at"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/newsletter"
              />
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((item, index) => (
              <tr key={item.id} className="border-t border-outline/60 hover:bg-background/50 transition-colors">
                <td className="px-4 py-3 text-on-surface/50">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{item.email}</td>
                <td className="px-4 py-3 text-on-surface/70">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-4 py-3">
                  <NewsletterDeleteButton id={item.id} email={item.email} />
                </td>
              </tr>
            ))}
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-on-surface/70">
                  <Mail size={40} className="mx-auto mb-3 text-on-surface/30" />
                  <p className="font-medium">Nenhum inscrito na newsletter ainda.</p>
                  <p className="text-xs mt-1">Os e-mails cadastrados no site aparecerão aqui.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
