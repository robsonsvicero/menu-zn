import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateAuthorAction } from "../../actions";
import { Image as ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

type Author = {
  id: string;
  name: string;
  role: string | null;
  instagram_url: string | null;
  avatar_url: string | null;
};

export default async function EditarAutorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: authorData } = await supabase
    .from("authors")
    .select("id, name, role, instagram_url, avatar_url")
    .eq("id", id)
    .single();

  if (!authorData) {
    notFound();
  }

  const author = authorData as Author;

  return (
    <section className="max-w-[900px] mx-auto space-y-10">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-serif text-on-surface font-bold">Autores</h2>
        <Link href="/admin/autores" className="rounded-full border border-outline/30 px-6 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:bg-[#faf8f5] transition">
          Voltar
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Informações</p>
          <h2 className="text-2xl font-serif text-on-surface font-bold">Editar Autor</h2>
        </div>

        <form action={updateAuthorAction} className="space-y-6">
          <input type="hidden" name="id" value={author.id} />
          <input type="hidden" name="current_avatar_url" value={author.avatar_url ?? ""} />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Nome completo *</label>
              <input name="name" defaultValue={author.name} required className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Cargo / Especialidade</label>
              <input name="role" defaultValue={author.role ?? ""} className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Link do Instagram</label>
              <input name="instagram_url" defaultValue={author.instagram_url ?? ""} className="w-full rounded-xl bg-[#faf8f5] border-transparent px-4 py-3 text-sm focus:border-outline outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-on-surface/60 mb-1.5 ml-1">Foto de Perfil</label>
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-3xl border border-dashed border-[#d2e2ff] bg-[#faf8f5] hover:bg-[#f3f8ff] transition cursor-pointer relative overflow-hidden group">
              <input type="file" name="image_file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" />
              <div className="flex flex-col items-center gap-2 z-10 relative">
                <div className="w-10 h-10 rounded-full bg-[#e8f1ff] flex items-center justify-center text-[#4F95FF] shadow-sm">
                  <ImageIcon size={18} />
                </div>
                <div className="text-center bg-white/80 px-4 py-1 rounded-full backdrop-blur-sm">
                  <p className="text-sm font-bold text-[#4F95FF]">Alterar foto</p>
                </div>
              </div>
              {author.avatar_url && (
                <img src={author.avatar_url} alt="Capa" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-20 transition" />
              )}
            </label>
          </div>

          <div className="pt-2">
            <button type="submit" className="rounded-full bg-primary px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:opacity-90 transition">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
