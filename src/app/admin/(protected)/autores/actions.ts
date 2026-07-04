"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function sanitizeFileName(input: string) {
  return slugify(input.replace(/\.[^/.]+$/, "")) || "arquivo";
}

function normalizeInstagramUrl(input: string) {
  const value = input.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("@")) {
    const handle = value.slice(1).trim().replace(/^\/+|\/+$/g, "");
    return handle ? `https://www.instagram.com/${handle}` : null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const handle = value
    .replace(/^instagram\.com\//i, "")
    .replace(/^www\.instagram\.com\//i, "")
    .replace(/^\/+|\/+$/g, "");

  return handle ? `https://www.instagram.com/${handle}` : null;
}

async function uploadAvatarImage(file: File, slug: string) {
  const adminClient = createAdminClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media-public";
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const safeExt = extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
  const safeBaseName = sanitizeFileName(file.name);
  const path = `authors/${slug}-${Date.now()}-${safeBaseName}.${safeExt}`;

  const { error: uploadError } = await adminClient.storage
    .from(bucket)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (uploadError) {
    if (uploadError.message.toLowerCase().includes("bucket not found")) {
      throw new Error(
        `Bucket '${bucket}' não encontrado no Supabase Storage. Crie o bucket e habilite acesso público para as imagens.`
      );
    }
    throw new Error(`Falha no upload da imagem: ${uploadError.message}`);
  }

  const { data } = adminClient.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

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

export async function createAuthorAction(formData: FormData) {
  const { supabase } = await ensureAdminAccess();

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const instagramUrl = normalizeInstagramUrl(String(formData.get("instagram_url") ?? ""));
  const imageFile = formData.get("image_file");

  if (!name) {
    throw new Error("Nome é obrigatório.");
  }

  const slug = slugify(name);
  let avatarUrl: string | null = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    avatarUrl = await uploadAvatarImage(imageFile, slug);
  }

  const { error } = await supabase.from("authors").insert({
    name,
    role: role || null,
    instagram_url: instagramUrl,
    avatar_url: avatarUrl,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/autores");
}

export async function deleteAuthorAction(formData: FormData) {
  const { supabase } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    throw new Error("ID inválido.");
  }

  // Verificar se há posts atrelados (opcional, Supabase vai falhar se tiver chave estrangeira restrita)
  const { error } = await supabase.from("authors").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/autores");
}

export async function updateAuthorAction(formData: FormData) {
  const { supabase } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const instagramUrl = normalizeInstagramUrl(String(formData.get("instagram_url") ?? ""));
  const imageFile = formData.get("image_file");
  const currentAvatarUrl = String(formData.get("current_avatar_url") ?? "").trim();

  if (!id || !name) {
    throw new Error("ID e nome são obrigatórios.");
  }

  const slug = slugify(name);
  let avatarUrl: string | null = currentAvatarUrl || null;

  if (imageFile instanceof File && imageFile.size > 0) {
    avatarUrl = await uploadAvatarImage(imageFile, slug);
  }

  const { error } = await supabase
    .from("authors")
    .update({
      name,
      role: role || null,
      instagram_url: instagramUrl,
      avatar_url: avatarUrl,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/autores");
  redirect("/admin/autores");
}
