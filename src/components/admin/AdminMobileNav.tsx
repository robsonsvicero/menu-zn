"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  X,
  Menu,
  LayoutDashboard,
  Store,
  BookOpen,
  Users,
  MessageSquareQuote,
  UserCog,
  Tags,
  Mail,
  LogOut,
} from "lucide-react";

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

type Props = {
  displayName: string;
  initials: string;
  avatarUrl?: string | null;
  roleCodes: string[];
};

export default function AdminMobileNav({ displayName, initials, roleCodes }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ── Mobile Top Header ── */}
      <header className="md:hidden h-14 border-b border-outline bg-white px-4 flex items-center justify-between shrink-0 sticky top-0 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center h-9 w-9 rounded-lg text-on-surface/70 hover:bg-background transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        <p className="font-serif text-base">Painel Admin</p>
        <div className="w-9" /> {/* spacer to center title */}
      </header>

      {/* ── Drawer Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Drawer Panel ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
          <div>
            <p className="text-xs uppercase tracking-widest text-on-surface/50">MENU ZN</p>
            <p className="font-serif text-base leading-tight">Painel Admin</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center h-9 w-9 rounded-lg text-on-surface/60 hover:bg-background transition-colors"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-5 py-4 border-b border-outline bg-background/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold border border-outline shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-on-surface/50 truncate">{roleCodes.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive(href)
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface/70 hover:bg-background hover:text-on-surface"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-outline p-4">
          <form action="/admin/login" method="get">
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
                window.location.href = "/admin/login";
              }}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-on-surface/60 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} className="shrink-0" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* ── Bottom Navigation Bar (mobile only) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-outline pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {navLinks.slice(0, 5).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors ${
                isActive(href) ? "text-primary" : "text-on-surface/50 hover:text-on-surface"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-[9px] font-medium leading-none tracking-wide">{label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
