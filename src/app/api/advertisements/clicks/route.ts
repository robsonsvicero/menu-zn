import { createAdminClient } from "@/lib/supabase/admin";

const advertisementIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let advertisementId: unknown;

  try {
    ({ advertisementId } = await request.json());
  } catch {
    return Response.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (
    typeof advertisementId !== "string" ||
    !advertisementIdPattern.test(advertisementId)
  ) {
    return Response.json({ error: "ID de anúncio inválido." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc(
    "increment_blog_advertisement_click",
    { advertisement_id: advertisementId },
  );

  if (error) {
    console.error("Erro ao registrar clique no anúncio.", error);
    return Response.json(
      { error: "Não foi possível registrar o clique." },
      { status: 500 },
    );
  }

  if (data === null) {
    return Response.json({ error: "Anúncio não encontrado ou inativo." }, { status: 404 });
  }

  return Response.json({ click_count: data });
}
