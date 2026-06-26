"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(email: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "E-mail inválido." };
  }

  const supabase = await createClient();

  // The created_at and id are handled by defaults
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: email.toLowerCase() });

  if (error) {
    // 23505 is the postgres error code for unique constraint violation
    if (error.code === "23505") {
      return { success: false, message: "Este e-mail já está cadastrado!" };
    }
    
    console.error("Newsletter subscription error:", error);
    return { success: false, message: "Ocorreu um erro ao assinar. Tente novamente." };
  }

  return { success: true, message: "Cadastro realizado com sucesso!" };
}
