import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateTestimonialStatusAction } from "./actions";
import { SortableHeader } from "@/components/admin/SortableHeader";

export const dynamic = "force-dynamic";

type TestimonialRow = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number | null;
  source: string | null;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
};

type SearchParams = {
  sort?: string;
  dir?: string;
};

export default async function AdminDepoimentosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const currentSort = params.sort ?? "created_at";
  const currentDir = params.dir ?? "desc";

  let query = supabase
    .from("testimonials")
    .select("id, author_name, author_role, content, rating, source, status, is_featured")
    .limit(100);

  query = query.order(currentSort as any, { ascending: currentDir === "asc", nullsFirst: false });

  const { data, error } = await query;

  const testimonials = (data ?? []) as TestimonialRow[];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif">Depoimentos</h2>
          <p className="text-sm text-on-surface/70 mt-1">Moderação de avaliações e opiniões publicadas no site.</p>
        </div>

        <Link href="/admin/depoimentos/novo" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          + Novo depoimento
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar depoimentos: {error.message}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <SortableHeader
                label="Autor"
                column="author_name"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/depoimentos"
              />
              <SortableHeader
                label="Nota"
                column="rating"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/depoimentos"
              />
              <SortableHeader
                label="Status"
                column="status"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/depoimentos"
              />
              <SortableHeader
                label="Destaque"
                column="is_featured"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/depoimentos"
              />
              <SortableHeader
                label="Fonte"
                column="source"
                currentSort={currentSort}
                currentDir={currentDir}
                baseUrl="/admin/depoimentos"
              />
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((item) => (
              <tr key={item.id} className="border-t border-outline/60">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.author_name}</div>
                  <div className="text-xs text-on-surface/60">{item.author_role ?? "-"}</div>
                </td>
                <td className="px-4 py-3">{item.rating ?? "-"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs uppercase tracking-wide">
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.is_featured ? "Sim" : "Não"}</td>
                <td className="px-4 py-3 text-on-surface/70">{item.source ?? "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/depoimentos/${item.id}/editar`} className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                      Editar
                    </Link>

                    {item.status !== "approved" ? (
                      <form action={updateTestimonialStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_status" value="approved" />
                        <button type="submit" className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                          Aprovar
                        </button>
                      </form>
                    ) : null}

                    {item.status !== "rejected" ? (
                      <form action={updateTestimonialStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_status" value="rejected" />
                        <button type="submit" className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                          Rejeitar
                        </button>
                      </form>
                    ) : null}

                    {item.status !== "pending" ? (
                      <form action={updateTestimonialStatusAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="next_status" value="pending" />
                        <button type="submit" className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background">
                          Pendente
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-on-surface/70">
                  Nenhum depoimento cadastrado ainda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-on-surface/60">Próxima entrega: criação/edição de depoimentos com aprovação e destaque.</p>
    </section>
  );
}
