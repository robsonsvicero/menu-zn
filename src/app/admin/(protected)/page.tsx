import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [establishmentsCount, postsCount, testimonialsCount] = await Promise.all([
    supabase.from("establishments").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
  ]);

  return (
    <section>
      <h2 className="text-3xl font-serif mb-6">Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <article className="rounded-2xl border border-outline bg-white p-5">
          <p className="text-sm text-on-surface/60">Estabelecimentos</p>
          <p className="text-3xl font-serif mt-2">{establishmentsCount.count ?? 0}</p>
        </article>

        <article className="rounded-2xl border border-outline bg-white p-5">
          <p className="text-sm text-on-surface/60">Posts no blog</p>
          <p className="text-3xl font-serif mt-2">{postsCount.count ?? 0}</p>
        </article>

        <article className="rounded-2xl border border-outline bg-white p-5">
          <p className="text-sm text-on-surface/60">Depoimentos</p>
          <p className="text-3xl font-serif mt-2">{testimonialsCount.count ?? 0}</p>
        </article>
      </div>

      <Link
        href="/admin/estabelecimentos"
        className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Gerenciar estabelecimentos
      </Link>
    </section>
  );
}
