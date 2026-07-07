import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  await supabase.auth.signOut().catch(() => {
    // Mesmo se a sessão já estiver inválida, o objetivo é limpar o estado do cliente.
  });

  return Response.json({ ok: true });
}