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

function formatDynamicPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 10) {
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
}

async function uploadCoverImage(file: File, slug: string) {
  const adminClient = createAdminClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media-public";
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const safeExt = extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
  const safeBaseName = sanitizeFileName(file.name);
  const path = `establishments/${slug}-${Date.now()}-${safeBaseName}.${safeExt}`;

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

export async function createEstablishmentAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const neighborhoodId = String(formData.get("neighborhood_id") ?? "").trim();
  const shortDescription = String(formData.get("short_description") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const websiteUrl = String(formData.get("website_url") ?? "").trim();
  const instagramUrl = String(formData.get("instagram_url") ?? "").trim();
  const imageCoverUrl = String(formData.get("image_cover_url") ?? "").trim();
  const priceRange = String(formData.get("price_range") ?? "").trim();
  const ratingInput = String(formData.get("rating") ?? "").replace(",", ".");
  const parsedRating = ratingInput ? parseFloat(ratingInput) : null;
  const rating = parsedRating !== null && !isNaN(parsedRating) ? parsedRating : null;
  const imageFile = formData.get("image_file");
  const hasIfood = formData.get("has_ifood") === "on";
  const isFeatured = formData.get("is_featured") === "on";
  const isIndicated = formData.get("is_indicated") === "on";
  const status = String(formData.get("status") ?? "draft").trim();

  if (!name || !categoryId) {
    throw new Error("Nome e categoria são obrigatórios.");
  }

  const slug = slugify(slugInput || name);
  const formattedPhone = formatDynamicPhone(phone);
  const formattedWhatsapp = formatDynamicPhone(whatsapp);
  let finalImageCoverUrl: string | null = imageCoverUrl || null;

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadedUrl = await uploadCoverImage(imageFile, slug);
    if (uploadedUrl) {
      finalImageCoverUrl = uploadedUrl;
    }
  }

  const { error } = await supabase.from("establishments").insert({
    name,
    slug,
    category_id: categoryId,
    neighborhood_id: neighborhoodId || null,
    short_description: shortDescription || null,
    description: description || null,
    address: address || null,
    phone: formattedPhone || null,
    whatsapp: formattedWhatsapp || null,
    website_url: websiteUrl || null,
    instagram_url: instagramUrl || null,
    image_cover_url: finalImageCoverUrl,
    price_range: priceRange || null,
    rating,
    has_ifood: hasIfood,
    is_featured: isFeatured,
    is_indicated: isIndicated,
    status: status === "published" || status === "archived" ? status : "draft",
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/estabelecimentos");
  redirect("/admin/estabelecimentos");
}

export async function updateEstablishmentStatusAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("next_status") ?? "").trim();

  if (!id || !["draft", "published", "archived"].includes(nextStatus)) {
    throw new Error("Dados inválidos para atualização de status.");
  }

  const { error } = await supabase
    .from("establishments")
    .update({
      status: nextStatus,
      updated_by: user.id,
      published_at: nextStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/estabelecimentos");
}

export async function updateEstablishmentAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const neighborhoodId = String(formData.get("neighborhood_id") ?? "").trim();
  const shortDescription = String(formData.get("short_description") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const websiteUrl = String(formData.get("website_url") ?? "").trim();
  const instagramUrl = String(formData.get("instagram_url") ?? "").trim();
  const imageCoverUrl = String(formData.get("image_cover_url") ?? "").trim();
  const priceRange = String(formData.get("price_range") ?? "").trim();
  const ratingInput = String(formData.get("rating") ?? "").replace(",", ".");
  const parsedRating = ratingInput ? parseFloat(ratingInput) : null;
  const rating = parsedRating !== null && !isNaN(parsedRating) ? parsedRating : null;
  const imageFile = formData.get("image_file");
  const currentImageCoverUrl = String(formData.get("current_image_cover_url") ?? "").trim();
  const hasIfood = formData.get("has_ifood") === "on";
  const isFeatured = formData.get("is_featured") === "on";
  const isIndicated = formData.get("is_indicated") === "on";
  const status = String(formData.get("status") ?? "draft").trim();

  if (!id || !name || !categoryId) {
    throw new Error("ID, nome e categoria são obrigatórios.");
  }

  const slug = slugify(slugInput || name);
  const formattedPhone = formatDynamicPhone(phone);
  const formattedWhatsapp = formatDynamicPhone(whatsapp);
  let finalImageCoverUrl: string | null = imageCoverUrl || currentImageCoverUrl || null;

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadedUrl = await uploadCoverImage(imageFile, slug);
    if (uploadedUrl) {
      finalImageCoverUrl = uploadedUrl;
    }
  }

  const { error } = await supabase
    .from("establishments")
    .update({
      name,
      slug,
      category_id: categoryId,
      neighborhood_id: neighborhoodId || null,
      short_description: shortDescription || null,
      description: description || null,
      address: address || null,
      phone: formattedPhone || null,
      whatsapp: formattedWhatsapp || null,
      website_url: websiteUrl || null,
      instagram_url: instagramUrl || null,
      image_cover_url: finalImageCoverUrl,
      price_range: priceRange || null,
      rating,
      has_ifood: hasIfood,
      is_featured: isFeatured,
      is_indicated: isIndicated,
      status: status === "published" || status === "archived" ? status : "draft",
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/estabelecimentos");
  redirect("/admin/estabelecimentos");
}

export async function addNeighborhoodAction(name: string) {
  const { supabase } = await ensureAdminAccess();

  const trimmedName = String(name ?? "").trim();

  if (!trimmedName) {
    throw new Error("Nome do bairro é obrigatório.");
  }

  // Verifica se o bairro já existe
  const { data: existingNeighborhood } = await supabase
    .from("neighborhoods")
    .select("id")
    .ilike("name", trimmedName)
    .single();

  if (existingNeighborhood) {
    throw new Error("Este bairro já existe.");
  }

  const slug = slugify(trimmedName);

  const { error } = await supabase.from("neighborhoods").insert({
    name: trimmedName,
    slug,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/estabelecimentos/novo");
}
