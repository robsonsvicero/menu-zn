"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);

async function ensureAdminAccess() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: roleRows, error: rolesError } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  if (rolesError) {
    throw new Error(rolesError.message);
  }

  const roleCodes = (roleRows ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  const hasAccess = roleCodes.some((code) => allowedAdminRoles.has(code));

  if (!hasAccess) {
    throw new Error("Acesso negado.");
  }

  return { supabase, user };
}

function parseRating(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    throw new Error("A nota deve estar entre 1 e 5.");
  }

  return parsed;
}

export async function createTestimonialAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const authorName = String(formData.get("author_name") ?? "").trim();
  const authorRole = String(formData.get("author_role") ?? "").trim();
  const authorAvatarUrl = String(formData.get("author_avatar_url") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const blogPostId = String(formData.get("blog_post_id") ?? "").trim();
  const rating = parseRating(formData.get("rating"));
  const status = String(formData.get("status") ?? "pending").trim();
  const isFeatured = formData.get("is_featured") === "on";

  if (!authorName || !content) {
    throw new Error("Nome do autor e conteúdo são obrigatórios.");
  }

  const { error } = await supabase.from("testimonials").insert({
    author_name: authorName,
    author_role: authorRole || null,
    author_avatar_url: authorAvatarUrl || null,
    content,
    source: source || null,
    blog_post_id: blogPostId || null,
    rating,
    status: status === "approved" || status === "rejected" ? status : "pending",
    is_featured: isFeatured,
    approved_by: status === "approved" ? user.id : null,
    approved_at: status === "approved" ? new Date().toISOString() : null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/depoimentos");
  redirect("/admin/depoimentos");
}

export async function updateTestimonialAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();
  const authorName = String(formData.get("author_name") ?? "").trim();
  const authorRole = String(formData.get("author_role") ?? "").trim();
  const authorAvatarUrl = String(formData.get("author_avatar_url") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const blogPostId = String(formData.get("blog_post_id") ?? "").trim();
  const rating = parseRating(formData.get("rating"));
  const status = String(formData.get("status") ?? "pending").trim();
  const isFeatured = formData.get("is_featured") === "on";

  if (!id || !authorName || !content) {
    throw new Error("ID, nome do autor e conteúdo são obrigatórios.");
  }

  const approved = status === "approved";

  const { error } = await supabase
    .from("testimonials")
    .update({
      author_name: authorName,
      author_role: authorRole || null,
      author_avatar_url: authorAvatarUrl || null,
      content,
      source: source || null,
      blog_post_id: blogPostId || null,
      rating,
      status: status === "approved" || status === "rejected" ? status : "pending",
      is_featured: isFeatured,
      approved_by: approved ? user.id : null,
      approved_at: approved ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/depoimentos");
  redirect("/admin/depoimentos");
}

export async function updateTestimonialStatusAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("next_status") ?? "").trim();

  if (!id || !["pending", "approved", "rejected"].includes(nextStatus)) {
    throw new Error("Dados inválidos para atualização de status.");
  }

  const { error } = await supabase
    .from("testimonials")
    .update({
      status: nextStatus,
      approved_by: nextStatus === "approved" ? user.id : null,
      approved_at: nextStatus === "approved" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/depoimentos");
}

export async function deleteTestimonialAction(id: string) {
  const { supabase } = await ensureAdminAccess();
  const testimonialId = id.trim();

  if (!testimonialId) {
    return { success: false, message: "ID do depoimento é obrigatório." };
  }

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", testimonialId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/depoimentos");
  return { success: true, message: "Depoimento removido com sucesso." };
}
