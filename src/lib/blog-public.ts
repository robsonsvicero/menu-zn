import { createClient } from "@/lib/supabase/server";

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  blog_categories: { name: string; slug: string }[] | null;
};

export type BlogDetailItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  blog_categories: { name: string; slug: string }[] | null;
};

export async function fetchPublishedBlogPosts(options?: {
  search?: string;
  category?: string;
  limit?: number;
}) {
  const supabase = await createClient();
  const limit = options?.limit ?? 24;

  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image_url, published_at, blog_categories(name, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (options?.category) {
    query = query.eq("blog_categories.slug", options.category);
  }

  if (options?.search) {
    const search = options.search.trim();
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%,slug.ilike.%${search}%`
      );
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BlogListItem[];
}

export async function fetchPublishedBlogPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content_md, cover_image_url, published_at, seo_title, seo_description, blog_categories(name, slug)")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as BlogDetailItem | null;
}

export async function fetchBlogCategoryOptions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_categories")
    .select("name, slug")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as { name: string; slug: string }[];
}
