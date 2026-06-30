"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export type BlogTestimonialFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialErrorState: BlogTestimonialFormState = {
  status: "error",
  message: "Nao foi possivel enviar seu depoimento. Tente novamente.",
};

function parseRating(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    return null;
  }

  return parsed;
}

export async function submitBlogTestimonialAction(
  _prevState: BlogTestimonialFormState,
  formData: FormData
): Promise<BlogTestimonialFormState> {
  const blogPostId = String(formData.get("blog_post_id") ?? "").trim();
  const blogPostSlug = String(formData.get("blog_post_slug") ?? "").trim();
  const authorName = String(formData.get("author_name") ?? "").trim();
  const authorRole = String(formData.get("author_role") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const rating = parseRating(formData.get("rating"));

  if (!blogPostId || !blogPostSlug || !authorName || !content) {
    return {
      status: "error",
      message: "Preencha nome e depoimento antes de enviar.",
    };
  }

  if (authorName.length > 120 || authorRole.length > 140 || content.length > 1200) {
    return {
      status: "error",
      message: "Revise o tamanho dos campos e tente novamente.",
    };
  }

  const supabase = createAdminClient();

  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("id, title, slug")
    .eq("id", blogPostId)
    .eq("slug", blogPostSlug)
    .eq("status", "published")
    .maybeSingle();

  if (postError || !post) {
    return initialErrorState;
  }

  const { error } = await supabase.from("testimonials").insert({
    author_name: authorName,
    author_role: authorRole || null,
    content,
    rating,
    source: `Blog: ${post.title}`,
    status: "pending",
    is_featured: false,
    blog_post_id: post.id,
  });

  if (error) {
    return initialErrorState;
  }

  revalidatePath("/admin/depoimentos");
  revalidatePath(`/blog/${post.slug}`);

  return {
    status: "success",
    message: "Depoimento enviado. Ele vai aparecer no site depois da moderacao.",
  };
}
