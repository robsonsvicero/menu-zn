import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateEstablishmentStatusAction } from "./actions";
import { SortableHeader } from "@/components/admin/SortableHeader";

export const dynamic = "force-dynamic";

type EstablishmentRow = {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  is_category_featured: boolean;
  is_indicated: boolean;
  rating: number | null;
  categories: { name: string }[] | { name: string } | null;
  neighborhoods: { name: string }[] | { name: string } | null;
};

type SearchParams = {
  q?: string;
  status?: string;
  category?: string;
  indicated?: string;
  rating?: string;
  sort?: string;
  dir?: string;
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
  const indicatedFilter = (params.indicated ?? "").trim();
  const currentSort = params.sort ?? "created_at";
  const currentDir = params.dir ?? "desc";

  const getRelationName = (
    relation: { name: string }[] | { name: string } | null | undefined
  ) => {
    if (!relation) return "-";
    if (Array.isArray(relation)) {
      return relation[0]?.name ?? "-";
    }
    return relation.name ?? "-";
  };

  let query = supabase
    .from("establishments")
    .select("id, name, slug, status, is_featured, is_category_featured, is_indicated, rating, category_id, categories(name), neighborhoods(name)")
    .limit(100);

  // Apply sorting
  if (currentSort === "category") {
     // Sorting by relation might be tricky or unsupported out of the box depending on Supabase version,
     // we'll fallback to name or let the API handle it if possible. For foreign tables, we might just not sort.
     // To keep it simple, we sort on root table columns only.
  } else {
     query = query.order(currentSort as any, { ascending: currentDir === "asc", nullsFirst: false });
  }

  if (statusFilter && ["draft", "published", "archived"].includes(statusFilter)) {
    query = query.eq("status", statusFilter);
  }

  if (categoryFilter) {
    query = query.eq("category_id", categoryFilter);
  }

  if (indicatedFilter === "true") {
    query = query.eq("is_indicated", true);
  }

  if (indicatedFilter === "false") {
    query = query.eq("is_indicated", false);
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
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif">Estabelecimentos</h2>
          <p className="text-sm text-on-surface/70 mt-1">
            Lista conectada ao Supabase com status de publicação.
          </p>
        </div>

        <Link
          href="/admin/estabelecimentos/novo"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 whitespace-nowrap"
        >
          + Novo estabelecimento
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar estabelecimentos: {error.message}
        </div>
      ) : null}

      <form method="get" className="mb-5 grid gap-3 rounded-2xl border border-outline bg-white p-4 md:grid-cols-[1fr_180px_220px_180px_auto_auto]">
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

        <select
          name="indicated"
          defaultValue={indicatedFilter}
          className="w-full rounded-xl border border-outline px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas indicações</option>
          <option value="true">Indicados</option>
          <option value="false">Não indicados</option>
        </select>

        <button type="submit" className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background">
          Filtrar
        </button>

        <Link href="/admin/estabelecimentos" className="rounded-xl border border-outline px-4 py-2 text-sm hover:bg-background text-center">
          Limpar
        </Link>
      </form>

      {/* ── Mobile card list ── */}
      <div className="md:hidden space-y-3">
        {establishments.length === 0 ? (
          <div className="rounded-2xl border border-outline bg-white p-8 text-center text-sm text-on-surface/60">
            Nenhum estabelecimento cadastrado ainda.
          </div>
        ) : null}
        {establishments.map((item) => (
          <div key={item.id} className="rounded-2xl border border-outline bg-white p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-xs text-on-surface/55 mt-0.5 truncate">{item.slug}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                item.status === "published"
                  ? "bg-green-100 text-green-700"
                  : item.status === "archived"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {item.status === "published" ? "Publicado" : item.status === "archived" ? "Arquivado" : "Rascunho"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-on-surface/65 mb-4">
              <div><span className="font-medium text-on-surface/40 block">Categoria</span>{getRelationName(item.categories)}</div>
              <div><span className="font-medium text-on-surface/40 block">Bairro</span>{getRelationName(item.neighborhoods)}</div>
              <div><span className="font-medium text-on-surface/40 block">Dest. Princ.</span>{item.is_featured ? "✓ Sim" : "Não"}</div>
              <div><span className="font-medium text-on-surface/40 block">Dest. Categ.</span>{item.is_category_featured ? "✓ Sim" : "Não"}</div>
              <div><span className="font-medium text-on-surface/40 block">Avaliação</span>{item.rating !== null ? item.rating.toFixed(1) : "—"}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/estabelecimentos/${item.id}/editar`}
                className="flex-1 text-center rounded-lg border border-outline px-3 py-2 text-xs font-medium hover:bg-background"
              >
                Editar
              </Link>

              {item.status !== "published" ? (
                <form action={updateEstablishmentStatusAction} className="flex-1">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="next_status" value="published" />
                  <button type="submit" className="w-full rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100">
                    Publicar
                  </button>
                </form>
              ) : null}

              {item.status !== "archived" ? (
                <form action={updateEstablishmentStatusAction} className="flex-1">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="next_status" value="archived" />
                  <button type="submit" className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100">
                    Arquivar
                  </button>
                </form>
              ) : null}

              {item.status !== "draft" ? (
                <form action={updateEstablishmentStatusAction} className="flex-1">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="next_status" value="draft" />
                  <button type="submit" className="w-full rounded-lg border border-outline px-3 py-2 text-xs font-medium hover:bg-background">
                    Rascunho
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <SortableHeader
                label="Nome"
                column="name"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <th className="px-4 py-3 text-left font-medium">Categoria</th>
              <th className="px-4 py-3 text-left font-medium">Bairro</th>
              <SortableHeader
                label="Status"
                column="status"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <SortableHeader
                label="Dest. Principal"
                column="is_featured"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <SortableHeader
                label="Dest. Categoria"
                column="is_category_featured"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <SortableHeader
                label="Indicado"
                column="is_indicated"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <SortableHeader
                label="Slug"
                column="slug"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <SortableHeader
                label="Avaliação"
                column="rating"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/estabelecimentos"
                extraParams={{ q: searchTerm, status: statusFilter, category: categoryFilter, indicated: indicatedFilter }}
              />
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {establishments.map((item) => (
              <tr key={item.id} className="border-t border-outline/60">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{getRelationName(item.categories)}</td>
                <td className="px-4 py-3">{getRelationName(item.neighborhoods)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs uppercase tracking-wide">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.is_featured ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">{item.is_category_featured ? "Sim" : "Não"}</td>
                <td className="px-4 py-3">{item.is_indicated ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 text-on-surface/70">{item.slug}</td>
                <td className="px-4 py-3">{item.rating !== null ? item.rating.toFixed(1) : "-"}</td>
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
