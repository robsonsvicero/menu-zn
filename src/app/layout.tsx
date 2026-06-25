import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-caslon",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.menuzonanorte.com.br"),
  title: "Menu Zona Norte | Restaurante alta gastronomia São Paulo",
  description:
    "Descubra os melhores restaurantes, bares, pizzarias e padarias da Zona Norte de São Paulo. Guia editorial de alta gastronomia em Santana, Tucuruvi e Cantareira.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Menu Zona Norte",
    title: "Menu Zona Norte | Restaurante alta gastronomia São Paulo",
    description:
      "Descubra os melhores restaurantes, bares, pizzarias e padarias da Zona Norte de São Paulo. Guia editorial de alta gastronomia em Santana, Tucuruvi e Cantareira.",
    images: [
      {
        url: "/images/hero-menuzn.png",
        width: 1200,
        height: 630,
        alt: "Menu Zona Norte — Alta Gastronomia SP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu Zona Norte | Restaurante alta gastronomia São Paulo",
    description:
      "Descubra os melhores restaurantes, bares, pizzarias e padarias da Zona Norte de São Paulo.",
    images: ["/images/hero-menuzn.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${caslon.variable} antialiased font-sans text-on-surface bg-background`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}