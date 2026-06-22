import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  const roleCodes = (roleRows ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  const hasAccess = roleCodes.some((code) => allowedAdminRoles.has(code));

  if (!hasAccess) {
    redirect("/admin/login?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="h-16 border-b border-outline bg-white px-6 md:px-10 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface/60">MENU ZN</p>
          <h1 className="font-serif text-xl leading-none">Painel Administrativo</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{profile?.full_name ?? "Usuário"}</p>
          <p className="text-xs text-on-surface/60">{roleCodes.join(", ")}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-outline bg-white p-4">
          <nav className="space-y-2">
            <Link href="/admin" className="block rounded-lg px-3 py-2 text-sm hover:bg-background">
              Dashboard
            </Link>
            <Link href="/admin/estabelecimentos" className="block rounded-lg px-3 py-2 text-sm hover:bg-background">
              Estabelecimentos
            </Link>
            <Link href="/admin/blog" className="block rounded-lg px-3 py-2 text-sm hover:bg-background">
              Blog
            </Link>
            <Link href="/admin/depoimentos" className="block rounded-lg px-3 py-2 text-sm hover:bg-background">
              Depoimentos
            </Link>
            <Link href="/admin/usuarios" className="block rounded-lg px-3 py-2 text-sm hover:bg-background">
              Usuários
            </Link>
          </nav>
        </aside>

        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
