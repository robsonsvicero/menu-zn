import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
            },
          ]
        : []),
    ],
  },
  async redirects() {
    return [
      // /bares-pub → /bares  (URL do Wix com alto rankeamento, posição ~8)
      {
        source: "/bares-pub",
        destination: "/bares",
        permanent: true,
      },
      // /post/:slug → /blog/:slug  (posts do blog indexados no Wix)
      {
        source: "/post/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
      // Estabelecimentos com URL plana no Wix → /local/:slug
      {
        source: "/osteriadaonca",
        destination: "/local/osteriadaonca",
        permanent: true,
      },
      // Páginas de categoria antigas do Wix
      {
        source: "/alta-gastronomia-restaurantes-sp",
        destination: "/restaurantes",
        permanent: true,
      },
      {
        source: "/culinaria-japonesa",
        destination: "/restaurantes",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    webpackBuildWorker: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
