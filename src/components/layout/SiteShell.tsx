"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (!pathname.startsWith("/blog/")) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
