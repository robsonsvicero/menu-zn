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
const advertisementIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateAdvertisementImage(
  image: FormDataEntryValue | null
): asserts image is File {
  if (!(image instanceof File) || image.size === 0) {
    throw new Error("Selecione a imagem do anúncio.");
  }

  if (!imageExtensions.has(image.type)) {
    throw new Error("Formato de imagem inválido. Use JPG, PNG, WebP ou AVIF.");
  }

  if (image.size > maxImageSize) {
    throw new Error("A imagem deve ter no máximo 4 MB.");
  }
}

async function uploadAdvertisementImage(image: File) {
  const extension = imageExtensions.get(image.type);
  if (!extension) {
    throw new Error("Formato de imagem inválido. Use JPG, PNG, WebP ou AVIF.");
  }

  const imagePath = `blog-advertisements/${crypto.randomUUID()}.${extension}`;
  const adminClient = createAdminClient();
  const { error } = await adminClient.storage
    .from(storageBucket)
    .upload(imagePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Falha no upload da imagem: ${error.message}`);
  }

  const { data } = adminClient.storage.from(storageBucket).getPublicUrl(imagePath);
  return { imagePath, imageUrl: data.publicUrl, adminClient };
}

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

  validateAdvertisementImage(image);
  const { imagePath, imageUrl, adminClient } = await uploadAdvertisementImage(image);
  const { error: insertError } = await supabase.from("blog_advertisements").insert({
    title,
    target_url: targetUrl,
    image_url: imageUrl,
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

export async function updateAdvertisementAction(formData: FormData) {
  const supabase = await ensureAdminAccess();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const targetUrl = validateTargetUrl(String(formData.get("target_url") ?? "").trim());
  const image = formData.get("image");
  const newImage = image instanceof File && image.size > 0 ? image : null;

  if (!advertisementIdPattern.test(id)) {
    throw new Error("ID de anúncio inválido.");
  }

  if (!title || title.length > 120) {
    throw new Error("Informe um texto de até 120 caracteres para o anúncio.");
  }

  if (newImage) {
    validateAdvertisementImage(newImage);
  }

  const { data: current, error: currentError } = await supabase
    .from("blog_advertisements")
    .select("image_path")
    .eq("id", id)
    .single();

  if (currentError || !current) {
    throw new Error(`Não foi possível localizar o anúncio: ${currentError?.message ?? "anúncio não encontrado."}`);
  }

  let uploadedImage: Awaited<ReturnType<typeof uploadAdvertisementImage>> | null = null;

  if (newImage) {
    uploadedImage = await uploadAdvertisementImage(newImage);
  }

  const updates = {
    title,
    target_url: targetUrl,
    is_active: formData.get("is_active") === "on",
    updated_at: new Date().toISOString(),
    ...(uploadedImage
      ? { image_url: uploadedImage.imageUrl, image_path: uploadedImage.imagePath }
      : {}),
  };
  const { error: updateError } = await supabase
    .from("blog_advertisements")
    .update(updates)
    .eq("id", id);

  if (updateError) {
    if (uploadedImage) {
      const { error: cleanupError } = await uploadedImage.adminClient.storage
        .from(storageBucket)
        .remove([uploadedImage.imagePath]);

      if (cleanupError) {
        throw new Error(
          `Não foi possível atualizar o anúncio (${updateError.message}) nem remover a nova imagem enviada (${cleanupError.message}).`
        );
      }
    }

    throw new Error(`Não foi possível atualizar o anúncio: ${updateError.message}`);
  }

  let cleanupWarning: string | null = null;

  if (uploadedImage) {
    const { error: cleanupError } = await uploadedImage.adminClient.storage
      .from(storageBucket)
      .remove([current.image_path]);

    if (cleanupError) {
      cleanupWarning = `Anúncio atualizado, mas não foi possível remover a imagem anterior: ${cleanupError.message}`;
    }
  }

  revalidateAdvertisementPages();
  redirect(
    cleanupWarning
      ? `/admin/anuncios?updated=1&warning=${encodeURIComponent(cleanupWarning)}`
      : "/admin/anuncios?updated=1"
  );
}

export async function toggleAdvertisementAction(formData: FormData) {
  const supabase = await ensureAdminAccess();
  const id = String(formData.get("id") ?? "").trim();
  const isActiveValue = String(formData.get("is_active") ?? "");

  if (!advertisementIdPattern.test(id) || !["true", "false"].includes(isActiveValue)) {
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

export async function deleteAdvertisementAction(id: string) {
  const supabase = await ensureAdminAccess();
  const advertisementId = id.trim();

  if (!advertisementIdPattern.test(advertisementId)) {
    return { success: false, message: "ID de anúncio inválido." };
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("blog_advertisements")
    .delete()
    .eq("id", advertisementId)
    .select("image_path")
    .maybeSingle();

  if (deleteError) {
    return { success: false, message: `Não foi possível excluir o anúncio: ${deleteError.message}` };
  }

  if (!deleted) {
    return { success: false, message: "Anúncio não encontrado ou já excluído." };
  }

  const adminClient = createAdminClient();
  const { error: storageError } = await adminClient.storage
    .from(storageBucket)
    .remove([deleted.image_path]);

  revalidateAdvertisementPages();

  if (storageError) {
    return {
      success: true,
      message: "Anúncio excluído.",
      warning: `Não foi possível remover a imagem: ${storageError.message}`,
    };
  }

  return { success: true, message: "Anúncio excluído com sucesso." };
}
