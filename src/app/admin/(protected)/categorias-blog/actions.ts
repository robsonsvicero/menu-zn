"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCategoryAction(formData: FormData) {
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;

  if (!name) {
    redirect(`/admin/categorias-blog/novo?error=${encodeURIComponent("Nome é obrigatório.")}`);
  }

  if (!slug) {
    slug = slugify(name);
  }

  const supabase = await createClient();

  const { error } = await supabase.from("blog_categories").insert({
    name,
    slug,
  });

  if (error) {
    redirect(`/admin/categorias-blog/novo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categorias-blog");
  revalidatePath("/admin/blog");
  redirect("/admin/categorias-blog");
}

export async function updateCategoryAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  let slug = formData.get("slug") as string;

  if (!id || !name) {
    redirect(`/admin/categorias-blog/${id}/editar?error=${encodeURIComponent("Campos obrigatórios faltando.")}`);
  }

  if (!slug) {
    slug = slugify(name);
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("blog_categories")
    .update({ name, slug })
    .eq("id", id);

  if (error) {
    redirect(`/admin/categorias-blog/${id}/editar?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categorias-blog");
  revalidatePath("/admin/blog");
  redirect("/admin/categorias-blog");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get("id") as string;

  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);

  if (error) {
    // A deletion might fail due to foreign key constraints if it's assigned to posts
    redirect(`/admin/categorias-blog?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categorias-blog");
  revalidatePath("/admin/blog");
  redirect("/admin/categorias-blog");
}
