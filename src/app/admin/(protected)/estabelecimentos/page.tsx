import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateEstablishmentStatusAction } from "./actions";

export const dynamic = "force-dynamic";

type EstablishmentRow = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  is_indicated: boolean;
  categories: { name: string }[] | null;
  neighborhoods: { name: string }[] | null;
};

type SearchParams = {
  q?: string;
  status?: string;
  category?: string;
};

type CategoryFilterRow = {
  id: string;
  name: string;
};

export default async function AdminEstabelecimentosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const searchTerm = (params.q ?? "").trim();
  const statusFilter = (params.status ?? "").trim();
  const categoryFilter = (params.category ?? "").trim();

  let query = supabase
    .from("establishments")
    .select("id, name, slug, status, is_featured, is_indicated, category_id, categories(name), neighborhoods(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (statusFilter && ["draft", "published", "archived"].includes(statusFilter)) {
    query = query.eq("status", statusFilter);
  }

  if (categoryFilter) {
    query = query.eq("category_id", categoryFilter);
  }

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
  }

  const [{ data, error }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("id, name").order("name"),
  ]);

  const establishments = (data ?? []) as EstablishmentRow[];
  const categoryOptions = (categories ?? []) as CategoryFilterRow[];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif">Estabelecimentos</h2>
          <p className="text-sm text-on-surface/70 mt-1">
            Lista conectada ao Supabase com status de publicação.
          </p>
        </div>

        <Link
          href="/admin/estabelecimentos/novo"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Novo estabelecimento
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar estabelecimentos: {error.message}
        </div>
      ) : null}

      <form method="get" className="mb-5 grid gap-3 rounded-2xl border border-outline bg-white p-4 md:grid-cols-[1fr_180px_220px_auto_auto]">
        <input
          type="text"
          name="q"
          defaultValue={searchTerm}
          placeholder="Buscar por nome ou slug"
          className="w-full rounded-xl border border-outline px-3 py-2 text-sm"
        />

        <select
          name="status"
          defaultValue={statusFilter}
          className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white"
        >
          <option value="">Todos status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>

        <select
          name="category"
          defaultValue={categoryFilter}
          className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas categorias</option>
          {categoryOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        <button type="submit" className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background">
          Filtrar
        </button>

        <Link href="/admin/estabelecimentos" className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background text-center">
          Limpar
        </Link>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Categoria</th>
              <th className="px-4 py-3 text-left font-medium">Bairro</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Destaque</th>
              <th className="px-4 py-3 text-left font-medium">Indicado</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {establishments.map((item) => (
              <tr key={item.id} className="border-t border-outline/60">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.categories?.[0]?.name ?? "-"}</td>
                <td className="px-4 py-3">{item.neighborhoods?.[0]?.name ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs uppercase tracking-wide">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.is_featured ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">{item.is_indicated ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 text-on-surface/70">{item.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/estabelecimentos/${item.id}/editar`}
                      className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background"
                    >
                      Editar
                    </Link>

                    {item.status !== "published" ? (
                      <form action={updateEstablishmentStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_status" value="published" />
                        <button
                          type="submit"
                          className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background"
                        >
                          Publicar
                        </button>
                      </form>
                    ) : null}

                    {item.status !== "archived" ? (
                      <form action={updateEstablishmentStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_status" value="archived" />
                        <button
                          type="submit"
                          className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background"
                        >
                          Arquivar
                        </button>
                      </form>
                    ) : null}

                    {item.status !== "draft" ? (
                      <form action={updateEstablishmentStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_status" value="draft" />
                        <button
                          type="submit"
                          className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background"
                        >
                          Rascunho
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {establishments.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-on-surface/70">
                  Nenhum estabelecimento cadastrado ainda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-on-surface/60">Cadastro, edição e troca de status já estão ativos.</p>

      <div className="mt-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">
          Voltar ao dashboard
        </Link>
      </div>
    </section>
  );
}
