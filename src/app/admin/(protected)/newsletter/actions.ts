"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteNewsletterSubscriber(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/newsletter");
  return { success: true, message: "Inscrito removido com sucesso." };
}
