import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export default async function AdminCategoriasBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { error: searchError } = await searchParams;

  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  const categories = (data ?? []) as CategoryRow[];

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-serif">Categorias do Blog</h2>
          <p className="text-sm text-on-surface/70 mt-1">Gerencie as categorias disponíveis para os artigos.</p>
        </div>

        <Link href="/admin/categorias-blog/novo" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          + Nova categoria
        </Link>
      </div>

      {searchError ? (
        <div className="mb-6 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          {searchError}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao carregar categorias: {error.message}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-outline bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-on-surface/70">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-outline/60">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-on-surface/70">{cat.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/categorias-blog/${cat.id}/editar`}
                      className="rounded-lg border border-outline px-2.5 py-1 text-xs hover:bg-background"
                    >
                      Editar
                    </Link>

                    <form action={deleteCategoryAction}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button 
                        type="submit" 
                        className="rounded-lg border border-error/30 px-2.5 py-1 text-xs text-error hover:bg-error/10"
                        onClick={(e) => {
                          if (!confirm("Tem certeza que deseja excluir esta categoria?")) e.preventDefault();
                        }}
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-on-surface/70">
                  Nenhuma categoria cadastrada ainda.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
