"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedAdminRoles = new Set(["super_admin", "admin", "editor"]);
const maxImageSize = 4 * 1024 * 1024;
const imageExtensions = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media-public";

async function ensureAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: roleRows, error } = await supabase
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Não foi possível validar seu acesso: ${error.message}`);
  }

  const roleCodes = (roleRows ?? [])
    .map((row) => (row as { roles?: { code?: string } | null }).roles?.code)
    .filter((code): code is string => Boolean(code));

  if (!roleCodes.some((code) => allowedAdminRoles.has(code))) {
    throw new Error("Acesso negado.");
  }

  return supabase;
}

function revalidateAdvertisementPages() {
  revalidatePath("/admin/anuncios");
  revalidatePath("/blog/[slug]", "page");
}

function validateTargetUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error("Informe um link completo e válido, começando com https:// ou http://.");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error("O link deve usar o protocolo http:// ou https://.");
  }

  return url.toString();
}

export async function createAdvertisementAction(formData: FormData) {
  const supabase = await ensureAdminAccess();
  const title = String(formData.get("title") ?? "").trim();
  const targetUrl = validateTargetUrl(String(formData.get("target_url") ?? "").trim());
  const image = formData.get("image");
  const isActive = formData.get("is_active") === "on";

  if (!title || title.length > 120) {
    throw new Error("Informe um texto de até 120 caracteres para o anúncio.");
  }

  if (!(image instanceof File) || image.size === 0) {
    throw new Error("Selecione a imagem do anúncio.");
  }

  const extension = imageExtensions.get(image.type);
  if (!extension) {
    throw new Error("Formato de imagem inválido. Use JPG, PNG, WebP ou AVIF.");
  }

  if (image.size > maxImageSize) {
    throw new Error("A imagem deve ter no máximo 4 MB.");
  }

  const imagePath = `blog-advertisements/${crypto.randomUUID()}.${extension}`;
  const adminClient = createAdminClient();
  const { error: uploadError } = await adminClient.storage
    .from(storageBucket)
    .upload(imagePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Falha no upload da imagem: ${uploadError.message}`);
  }

  const { data: publicImage } = adminClient.storage
    .from(storageBucket)
    .getPublicUrl(imagePath);
  const { error: insertError } = await supabase.from("blog_advertisements").insert({
    title,
    target_url: targetUrl,
    image_url: publicImage.publicUrl,
    image_path: imagePath,
    is_active: isActive,
  });

  if (insertError) {
    const { error: cleanupError } = await adminClient.storage
      .from(storageBucket)
      .remove([imagePath]);

    if (cleanupError) {
      throw new Error(
        `Não foi possível salvar o anúncio (${insertError.message}) nem remover a imagem enviada (${cleanupError.message}).`
      );
    }

    throw new Error(`Não foi possível salvar o anúncio: ${insertError.message}`);
  }

  revalidateAdvertisementPages();
  redirect("/admin/anuncios?created=1");
}

export async function toggleAdvertisementAction(formData: FormData) {
  const supabase = await ensureAdminAccess();
  const id = String(formData.get("id") ?? "").trim();
  const isActiveValue = String(formData.get("is_active") ?? "");

  if (!/^[0-9a-f-]{36}$/i.test(id) || !["true", "false"].includes(isActiveValue)) {
    throw new Error("Dados inválidos para atualizar o anúncio.");
  }

  const { error } = await supabase
    .from("blog_advertisements")
    .update({ is_active: isActiveValue === "true", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Não foi possível atualizar o anúncio: ${error.message}`);
  }

  revalidateAdvertisementPages();
}
