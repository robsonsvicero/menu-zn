import { Button } from "@/components/ui/button";
import Image from "next/image";
import StatsBar from "@/components/sections/StatsBar";  
import Categories from "@/components/sections/Categories";
import Newsletter from "@/components/sections/Newsletter";

export default function ZonaNortePage() {
  return (
    <main className="min-h-screen">
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-zonanorte.png" 
            alt="Alta gastronomia na Zona Norte" 
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 md:px-8 mt-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-serif font-bold text-white leading-[1.1] mb-6">
              Alta gastronomia na<br />Zona Norte.
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-serif italic mb-10 max-w-2xl leading-relaxed">
              Explore os sabores mais autênticos de Santana, Tucuruvi e Cantareira através do nosso guia editorial exclusivo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="lg" className="w-full sm:w-auto text-base">
                Explorar Restaurantes
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
                Anuncie seu negócio
              </Button>
            </div>
          </div>
        </div>
      </section>
      <StatsBar />
      <Categories />
      <Newsletter />
    </main>
  );
}
