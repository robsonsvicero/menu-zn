import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, LayoutDashboard, Store, BookOpen, Users, MessageSquareQuote, UserCog, Tags, Mail } from "lucide-react";
import AdminMobileNav from "@/components/admin/AdminMobileNav";

export const dynamic = "force-dynamic";

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/estabelecimentos", label: "Estabelecimentos", icon: Store },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/categorias-blog", label: "Categorias", icon: Tags },
  { href: "/admin/autores", label: "Autores", icon: Users },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/usuarios", label: "Usuários", icon: UserCog },
];

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  let user = null;

  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    redirect("/admin/login");
  }

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
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

  const displayName = profile?.full_name ?? "Usuário";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col w-65 shrink-0 border-r border-outline bg-white sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-outline">
          <p className="text-xs uppercase tracking-widest text-on-surface/50">MENU ZN</p>
          <p className="font-serif text-lg leading-tight">Painel Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-on-surface/70 hover:bg-background hover:text-on-surface transition-colors"
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-outline p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0 border border-outline">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={displayName}
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-on-surface/50 truncate">{roleCodes.join(", ")}</p>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-on-surface/60 hover:bg-background hover:text-error transition-colors"
            >
              <LogOut size={15} className="shrink-0" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Nav (hamburger + drawer + bottom bar) */}
        <AdminMobileNav
          displayName={displayName}
          initials={initials}
          avatarUrl={profile?.avatar_url}
          roleCodes={roleCodes}
        />

        {/* Main content — extra bottom padding on mobile for bottom bar */}
        <main className="flex-1 p-4 pb-24 md:p-10 md:pb-10">{children}</main>
      </div>
    </div>
  );
}
