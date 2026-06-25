import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { updateCategoryAction } from "../../actions";

export default async function EditarCategoriaBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (!category) {
    notFound();
  }

  return (
    <section className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/categorias-blog"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-outline bg-white text-on-surface/70 hover:bg-background"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-3xl font-serif">Editar Categoria</h2>
          <p className="text-sm text-on-surface/70 mt-1">Modifique as informações desta categoria.</p>
        </div>
      </div>

      {error ? (
        <div className="mb-6 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
          Erro ao salvar categoria: {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-outline bg-white p-6 md:p-8">
        <form action={updateCategoryAction} className="space-y-6">
          <input type="hidden" name="id" value={category.id} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={category.name}
                className="w-full rounded-xl border border-outline px-4 py-2.5 outline-none focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">Slug (URL) - opcional</label>
              <input
                type="text"
                id="slug"
                name="slug"
                defaultValue={category.slug}
                className="w-full rounded-xl border border-outline px-4 py-2.5 outline-none focus:border-primary"
              />
              <p className="text-xs text-on-surface/50">Deixe em branco para gerar automaticamente baseado no nome.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-2.5 font-medium text-white transition hover:opacity-90"
            >
              Salvar Alterações
            </button>
            <Link
              href="/admin/categorias-blog"
              className="rounded-xl border border-outline px-6 py-2.5 font-medium hover:bg-background"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
