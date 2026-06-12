import { Button } from "@/components/ui/button";
import Image from "next/image";
import RestaurantDirectory from "@/components/sections/RestaurantDirectory";
import SommelierCta from "@/components/sections/SommelierCta";

export default function RestaurantesPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-restaurantes.png" 
            alt="Os Melhores Restaurantes da Zona Norte" 
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 md:px-8 mt-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-serif font-bold text-white leading-[1.1] mb-6">
              Os Melhores<br />Restaurantes da Zona Norte
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-sans mb-10 max-w-2xl leading-relaxed font-light">
              Uma seleção rigorosa e apaixonada pelo que há de mais extraordinário no cenário gastronômico local. Do tradicional ao contemporâneo, descubra sabores que definem a nossa região.
            </p>
            
            <Button variant="default" size="lg" className="px-8 tracking-widest uppercase font-bold text-sm">
              Explorar Guia
            </Button>
          </div>
        </div>
      </section>

      {/* Directory Section containing Filters and Grid */}
      <RestaurantDirectory />

      {/* Sommelier CTA */}
      <SommelierCta />

    </main>
  );
}
