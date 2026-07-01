import type { MetadataRoute } from "next";
import { fetchPublishedEstablishments } from "@/lib/establishments-public";
import { fetchPublishedBlogPosts } from "@/lib/blog-public";

const BASE_URL = "https://www.menuzonanorte.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // --- Rotas estáticas ---
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/restaurantes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bares`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pizzarias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/padarias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hamburguerias`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/zona-norte`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/parceiros`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/planos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // --- Estabelecimentos dinâmicos ---
  let establishmentRoutes: MetadataRoute.Sitemap = [];
  try {
    const establishments = await fetchPublishedEstablishments({ limit: 500 });
    establishmentRoutes = establishments.map((item) => ({
      url: `${BASE_URL}/local/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Em caso de falha no Supabase, não quebra o sitemap
  }

  // --- Posts do blog dinâmicos ---
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchPublishedBlogPosts({ limit: 500 });
    blogRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Em caso de falha no Supabase, não quebra o sitemap
  }

  return [...staticRoutes, ...establishmentRoutes, ...blogRoutes];
}
