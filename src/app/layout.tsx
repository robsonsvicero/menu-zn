import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  title: "Menu ZN | O guia gastronômico da Zona Norte",
  description: "Descubra os melhores restaurantes, bares e pizzarias da Zona Norte de São Paulo.",
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
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}