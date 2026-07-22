import { createClient } from "@/lib/supabase/server";

export type BlogCategoryRelation =
  | { name: string; slug: string }
  | { name: string; slug: string }[]
  | null;

export type BlogAuthor = {
  name: string;
  avatar_url: string | null;
  role: string | null;
  instagram_url: string | null;
} | null;

export type BlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  view_count: number | null;
  blog_categories: BlogCategoryRelation;
  authors: BlogAuthor;
};

export type BlogDetailItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  view_count: number | null;
  seo_title: string | null;
  seo_description: string | null;
  blog_categories: BlogCategoryRelation;
  authors: BlogAuthor;
};

export type BlogTestimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number | null;
  created_at: string;
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
    .select("id, title, slug, excerpt, cover_image_url, published_at, view_count, blog_categories(name, slug), authors(name, avatar_url, role, instagram_url)")
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

  return (data ?? []) as unknown as BlogListItem[];
}

export async function fetchPublishedBlogPostBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content_md, cover_image_url, published_at, view_count, seo_title, seo_description, blog_categories(name, slug), authors(name, avatar_url, role, instagram_url)")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as unknown as BlogDetailItem | null;
}

export async function fetchBlogPostBySlugForAdminPreview(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content_md, cover_image_url, published_at, view_count, seo_title, seo_description, blog_categories(name, slug), authors(name, avatar_url, role, instagram_url)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as unknown as BlogDetailItem | null;
}

export async function fetchApprovedBlogTestimonials(blogPostId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, author_role, content, rating, created_at")
    .eq("blog_post_id", blogPostId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BlogTestimonial[];
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
