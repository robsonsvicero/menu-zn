import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let slug: unknown;

  try {
    ({ slug } = await request.json());
  } catch {
    return Response.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (typeof slug !== "string" || !slug.trim()) {
    return Response.json({ error: "Slug obrigatório." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("increment_blog_post_view", {
    post_slug: slug.trim(),
  });

  if (error) {
    console.error("Erro ao incrementar visualização do blog", error);
    return Response.json({ error: "Não foi possível registrar a visualização." }, { status: 500 });
  }

  if (data === null) {
    return Response.json({ error: "Artigo não encontrado." }, { status: 404 });
  }

  return Response.json({ view_count: data });
}
