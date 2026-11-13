"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const allowedRoles = new Set(["super_admin", "admin", "editor"]);
const maxImageSize = 4 * 1024 * 1024;
const imageExtensions = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media-public";

async function ensureAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado.");
  const { data, error } = await supabase.from("user_roles").select("roles(code)").eq("user_id", user.id);
  if (error) throw new Error(`Não foi possível validar seu acesso: ${error.message}`);
  const roles = (data ?? []).map((row) => (row as { roles?: { code?: string } | null }).roles?.code);
  if (!roles.some((role) => role && allowedRoles.has(role))) throw new Error("Acesso negado.");
  return supabase;
}

function validateImage(value: FormDataEntryValue | null): asserts value is File {
  if (!(value instanceof File) || value.size === 0) throw new Error("Selecione uma imagem.");
  if (!imageExtensions.has(value.type)) throw new Error("Formato inválido. Use JPG, PNG, WebP ou AVIF.");
  if (value.size > maxImageSize) throw new Error("A imagem deve ter no máximo 4 MB.");
}

async function uploadImage(image: File, folder: string) {
  validateImage(image);
  const adminClient = createAdminClient();
  const imagePath = `${folder}/${crypto.randomUUID()}.${imageExtensions.get(image.type)}`;
  const { error } = await adminClient.storage.from(storageBucket).upload(imagePath, image, {
    contentType: image.type,
    upsert: false,
  });
  if (error) throw new Error(`Falha no upload da imagem: ${error.message}`);
  const { data } = adminClient.storage.from(storageBucket).getPublicUrl(imagePath);
  return { imagePath, imageUrl: data.publicUrl, adminClient };
}

export async function createStorefrontAction(formData: FormData) {
  const supabase = await ensureAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const bannerImage = formData.get("banner_image");
  if (!title || title.length > 120) throw new Error("Informe um título de até 120 caracteres.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) {
    throw new Error("O slug deve conter apenas letras minúsculas, números e hífens.");
  }
  validateImage(bannerImage);
  const upload = await uploadImage(bannerImage, "storefronts");
  const { error } = await supabase.from("storefronts").insert({
    title,
    slug,
    banner_image_url: upload.imageUrl,
    banner_image_path: upload.imagePath,
    is_active: true,
  });
  if (error) {
    await upload.adminClient.storage.from(storageBucket).remove([upload.imagePath]);
    throw new Error(`Não foi possível cadastrar a vitrine: ${error.message}`);
  }
  revalidatePath("/admin/vitrines");
  redirect("/admin/vitrines?created=1");
}

export async function createStorefrontProductAction(formData: FormData) {
  const supabase = await ensureAdmin();
  const storefrontId = String(formData.get("storefront_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const image = formData.get("image");
  const priceText = String(formData.get("price") ?? "").trim().replace(",", ".");
  const price = Number(priceText);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(storefrontId)) {
    throw new Error("Vitrine inválida.");
  }
  if (!name || name.length > 120) throw new Error("Informe um nome de produto de até 120 caracteres.");
  if (!Number.isFinite(price) || price < 0 || price > 99999999) throw new Error("Informe um preço válido.");
  validateImage(image);
  const upload = await uploadImage(image, "storefront-products");
  const { data: products } = await supabase.from("storefront_products").select("sort_order").eq("storefront_id", storefrontId).order("sort_order", { ascending: false }).limit(1);
  const nextOrder = (products?.[0]?.sort_order ?? -1) + 1;
  const { error } = await supabase.from("storefront_products").insert({ storefront_id: storefrontId, name, image_url: upload.imageUrl, image_path: upload.imagePath, price, sort_order: nextOrder, is_active: true });
  if (error) {
    await upload.adminClient.storage.from(storageBucket).remove([upload.imagePath]);
    throw new Error(`Não foi possível cadastrar o produto: ${error.message}`);
  }
  revalidatePath("/admin/vitrines");
  revalidatePath(`/vitrine/${String(formData.get("slug") ?? "")}`);
  redirect("/admin/vitrines?product_created=1");
}

export async function toggleStorefrontAction(formData: FormData) {
  const supabase = await ensureAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const nextState = String(formData.get("is_active")) === "true";
  const { error } = await supabase.from("storefronts").update({ is_active: nextState, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(`Não foi possível atualizar a vitrine: ${error.message}`);
  revalidatePath("/admin/vitrines");
  revalidatePath(`/vitrine/${slug}`);
}
