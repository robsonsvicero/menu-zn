import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAuthorAction, deleteAuthorAction } from "./actions";
import { User, Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

type AuthorRow = {
  id: string;
  name: string;
  role: string | null;
  instagram_url: string | null;
  avatar_url: string | null;
  created_at: string;
};

export default async function AdminAutoresPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("authors")
    .select("id, name, role, instagram_url, avatar_url, created_at")
    .order("created_at", { ascending: false });

  const authors = (data ?? []) as AuthorRow[];

  return (
    <section className="max-w-[900px] mx-auto space-y-10">
      <div className="bg-white p-6 md:p-10 rounded-3xl">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Novo Autor</p>
          <h2 className="text-2xl font-serif text-on-surface font-bold">Cadastrar Autor</h2>
        </div>

        <form action={createAuthorAction} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Nome completo *</label>
              <input name="name" required placeholder="Robson Svicero" className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Cargo / Especialidade</label>
              <input name="role" placeholder="Product Designer" className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Link do Instagram</label>
              <input name="instagram_url" placeholder="https://www.instagram.com/usuario" className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Foto de Perfil</label>
            <label className="flex flex-col items-center justify-center w-full h-32 rounded-3xl border border-dashed border-[#d2e2ff] bg-[#faf8f5] hover:bg-[#f3f8ff] transition cursor-pointer relative overflow-hidden group">
              <input type="file" name="image_file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#e8f1ff] flex items-center justify-center text-[#4F95FF]">
                  <ImageIcon size={16} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#4F95FF]">Upload da foto</p>
                </div>
              </div>
            </label>
          </div>

          <div className="pt-2">
            <button type="submit" className="rounded-full bg-primary px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
              Salvar Autor
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl">
        <div className="mb-8">
          <h2 className="text-2xl font-serif text-on-surface font-bold">Autores Cadastrados ({authors.length})</h2>
          {error ? (
            <p className="text-sm text-error mt-2">Você precisa rodar o script SQL para criar a tabela `authors` no Supabase.</p>
          ) : null}
        </div>

        <div className="space-y-4">
          {authors.map((author) => (
            <div key={author.id} className="flex items-center justify-between py-4 border-b border-outline/5 last:border-0">
              <div className="flex items-center gap-4">
                {author.avatar_url ? (
                  <img src={author.avatar_url} alt={author.name} className="w-12 h-12 rounded-full object-cover bg-outline/10" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#faf8f5] flex items-center justify-center">
                    <User size={18} className="text-on-surface/40" />
                  </div>
                )}
                <div>
                  <h4 className="text-base font-medium text-on-surface">{author.name}</h4>
                  {author.role && <p className="text-xs text-on-surface/50 mt-0.5">{author.role}</p>}
                  {author.instagram_url && <p className="text-xs text-on-surface/50 mt-0.5">{author.instagram_url}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/autores/${author.id}/editar`} className="rounded-full border border-outline/30 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-on-surface hover:bg-[#faf8f5] transition">
                  Editar
                </Link>
                <form action={deleteAuthorAction}>
                  <input type="hidden" name="id" value={author.id} />
                  <button type="submit" className="rounded-full bg-error px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}

          {authors.length === 0 && !error && (
            <p className="text-sm text-on-surface/50 italic py-4">Nenhum autor cadastrado ainda.</p>
          )}
        </div>
      </div>
    </section>
  );
}
