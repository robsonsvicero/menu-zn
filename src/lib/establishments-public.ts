import { createClient } from "@/lib/supabase/server";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type PublicNeighborhood = {
  id: string;
  name: string;
  slug: string;
};

export type EstablishmentListItem = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  website_url: string | null;
  instagram_url: string | null;
  image_cover_url: string | null;
  has_ifood: boolean;
  is_indicated: boolean;
  price_range: string | null;
  rating: number | null;
  categories: { name: string; slug: string }[] | null;
  neighborhoods: { name: string; slug: string }[] | null;
};

export type EstablishmentDetailItem = EstablishmentListItem & {
  description: string | null;
  average_ticket: number | null;
  latitude: number | null;
  longitude: number | null;
};

export async function fetchPublicCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PublicCategory[];
}

export async function fetchPublicNeighborhoods() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as PublicNeighborhood[];
}

async function resolveCategoryId(categorySlug?: string) {
  if (!categorySlug) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}

async function resolveNeighborhoodId(neighborhoodSlug?: string) {
  if (!neighborhoodSlug) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("neighborhoods")
    .select("id")
    .eq("slug", neighborhoodSlug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data?.id ?? null;
}

export async function fetchPublishedEstablishments(options?: {
  categorySlug?: string;
  search?: string;
  neighborhoodSlug?: string;
  ifoodOnly?: boolean;
  featuredOnly?: boolean;
  indicatedOnly?: boolean;
  sort?: "featured" | "rating" | "name";
  limit?: number;
}) {
  const supabase = await createClient();
  const limit = options?.limit ?? 24;
  const categoryId = await resolveCategoryId(options?.categorySlug);
  const neighborhoodId = await resolveNeighborhoodId(options?.neighborhoodSlug);

  let query = supabase
    .from("establishments")
    .select(
      "id, name, slug, short_description, address, phone, whatsapp, website_url, instagram_url, image_cover_url, has_ifood, is_indicated, price_range, rating, categories(name, slug), neighborhoods(name, slug)"
    )
    .eq("status", "published")
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (neighborhoodId) {
    query = query.eq("neighborhood_id", neighborhoodId);
  }

  if (options?.ifoodOnly) {
    query = query.eq("has_ifood", true);
  }

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options?.indicatedOnly) {
    query = query.eq("is_indicated", true);
  }

  const search = options?.search?.trim();
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,slug.ilike.%${search}%,short_description.ilike.%${search}%,address.ilike.%${search}%`
    );
  }

  switch (options?.sort) {
    case "rating":
      query = query.order("rating", { ascending: false, nullsFirst: false }).order("name");
      break;
    case "name":
      query = query.order("name");
      break;
    case "featured":
    default:
      query = query.order("is_featured", { ascending: false }).order("rating", { ascending: false, nullsFirst: false }).order("name");
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as EstablishmentListItem[];
}

export async function fetchPublishedEstablishmentBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("establishments")
    .select(
      "id, name, slug, short_description, description, address, phone, whatsapp, website_url, instagram_url, image_cover_url, has_ifood, is_indicated, price_range, average_ticket, rating, latitude, longitude, categories(name, slug), neighborhoods(name, slug)"
    )
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as EstablishmentDetailItem | null;
}
