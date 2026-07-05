import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import Script from "next/script";
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
        url: "/images/og-menuzn.jpg",
        width: 1200,
        height: 630,
        alt: "Menu Zona Norte | Restaurante alta gastronomia São Paulo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu Zona Norte | Restaurante alta gastronomia São Paulo",
    description:
      "Descubra os melhores restaurantes, bares, pizzarias e padarias da Zona Norte de São Paulo.",
    images: ["/images/og-menuzn.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/apple-touch-icon.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
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
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-D6PCTGJQC3"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-D6PCTGJQC3');
        `}
      </Script>
    </html>
  );
}
