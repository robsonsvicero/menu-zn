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

async function uploadCoverImage(file: File, slug: string) {
  const adminClient = createAdminClient();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media-public";
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const safeExt = extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
  const safeBaseName = sanitizeFileName(file.name);
  const path = `blog-posts/${slug}-${Date.now()}-${safeBaseName}.${safeExt}`;

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

export async function createBlogPostAction(formData: FormData) {
  try {
    const { supabase, user } = await ensureAdminAccess();

    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const contentMd = String(formData.get("content_md") ?? "").trim();
    const imageFile = formData.get("image_file");
    const categoryId = String(formData.get("category_id") ?? "").trim() || null;
    const authorId = String(formData.get("author_id") ?? "").trim();
    const publishedAtInput = String(formData.get("published_at") ?? "").trim();
    const seoTitle = String(formData.get("seo_title") ?? "").trim();
    const seoDescription = String(formData.get("seo_description") ?? "").trim();
    const status = String(formData.get("status") ?? "draft").trim();

    if (!title || !authorId) {
      throw new Error("Título e autor são obrigatórios.");
    }

    const slug = slugify(slugInput || title);
    let coverImageUrl: string | null = null;

    if (imageFile instanceof File && imageFile.size > 0) {
      coverImageUrl = await uploadCoverImage(imageFile, slug);
    }

    // Use the date provided by the user, or fallback to now if published without a date
    const publishedAt = status === "published"
      ? (publishedAtInput ? new Date(publishedAtInput).toISOString() : new Date().toISOString())
      : null;

    const { error } = await supabase.from("blog_posts").insert({
      title,
      slug,
      excerpt: excerpt || null,
      content_md: contentMd || null,
      cover_image_url: coverImageUrl,
      category_id: categoryId || null,
      status: status === "published" || status === "archived" ? status : "draft",
      published_at: publishedAt,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      created_by: user.id,
      updated_by: user.id,
      author_id: authorId,
    });

    if (error) {
      throw new Error("Erro ao salvar artigo no banco: " + error.message);
    }

  } catch (error: any) {
    console.error("Action Error (createBlogPostAction):", error);
    // Ignore redirect errors as they are thrown by next/navigation
    if (error.message === 'NEXT_REDIRECT') throw error;
    redirect(`/admin/blog/novo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPostStatusAction(formData: FormData) {
  const { supabase, user } = await ensureAdminAccess();

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("next_status") ?? "").trim();

  if (!id || !["draft", "published", "archived"].includes(nextStatus)) {
    throw new Error("Dados inválidos para atualização de status.");
  }

  const { error } = await supabase
    .from("blog_posts")
    .update({
      status: nextStatus,
      updated_by: user.id,
      published_at: nextStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  try {
    const { supabase, user } = await ensureAdminAccess();

    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const contentMd = String(formData.get("content_md") ?? "").trim();
    const imageFile = formData.get("image_file");
    const currentCoverImageUrl = String(formData.get("current_cover_image_url") ?? "").trim();
    const categoryId = String(formData.get("category_id") ?? "").trim() || null;
    const authorId = String(formData.get("author_id") ?? "").trim();
    const publishedAtInput = String(formData.get("published_at") ?? "").trim();
    const seoTitle = String(formData.get("seo_title") ?? "").trim();
    const seoDescription = String(formData.get("seo_description") ?? "").trim();
    const status = String(formData.get("status") ?? "draft").trim();

    if (!id || !title || !authorId) {
      throw new Error("ID, título e autor são obrigatórios.");
    }

    const slug = slugify(slugInput || title);
    let coverImageUrl: string | null = currentCoverImageUrl || null;

    if (imageFile instanceof File && imageFile.size > 0) {
      coverImageUrl = await uploadCoverImage(imageFile, slug);
    }

    // Use the date provided by the user, or fallback to now if published without a date
    const publishedAt = status === "published"
      ? (publishedAtInput ? new Date(publishedAtInput).toISOString() : new Date().toISOString())
      : null;

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt: excerpt || null,
        content_md: contentMd || null,
        cover_image_url: coverImageUrl,
        category_id: categoryId || null,
        status: status === "published" || status === "archived" ? status : "draft",
        published_at: publishedAt,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        updated_by: user.id,
        author_id: authorId,
      })
      .eq("id", id);

    if (error) {
      throw new Error("Erro ao salvar artigo no banco: " + error.message);
    }

  } catch (error: any) {
    console.error("Action Error (updateBlogPostAction):", error);
    if (error.message === 'NEXT_REDIRECT') throw error;
    redirect(`/admin/blog/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
