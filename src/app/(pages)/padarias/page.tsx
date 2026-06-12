import { Button } from "@/components/ui/button";
import Image from "next/image";
import BakeryDirectory from "@/components/sections/BakeryDirectory";
import SommelierCta from "@/components/sections/SommelierCta";

export default function PadariasPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] flex items-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-menuzn.png" 
            alt="As Melhores Padarias da Zona Norte" 
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
              O Pão Quentinho<br />e o Café Perfeito<br />Estão Aqui
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-sans mb-10 max-w-2xl leading-relaxed font-light">
              Do clássico pão na chapa na padaria de esquina aos croissants folhados e pães de fermentação natural nas boutiques artesanais. Descubra onde tomar o melhor café da manhã na ZN.
            </p>
            
            <Button variant="default" size="lg" className="px-8 tracking-widest uppercase font-bold text-sm">
              Sentar no Balcão
            </Button>
          </div>
        </div>
      </section>

      {/* Directory Section containing Filters and Grid */}
      <BakeryDirectory />

      {/* Sommelier CTA */}
      <SommelierCta />

    </main>
  );
}
