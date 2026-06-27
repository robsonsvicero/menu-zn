import type { Metadata } from "next";
import { Handshake, Megaphone, Camera, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Seja Parceiro | Menu Zona Norte",
  description:
    "Faça parte da rede oficial do Menu Zona Norte. Junte-se a nós como criador de conteúdo, fotógrafo, agência ou parceiro estratégico.",
};

const whatsappUrl = "https://w.app/xkvhoo";

export default function ParceirosPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-menuzn.png" alt="Menu ZN Parcerias" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:px-10 lg:px-12 md:py-40 text-center text-white">
          <span className="inline-block rounded-full border border-[rgb(214_152_105)]/30 bg-[rgb(214_152_105)]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[rgb(214_152_105)] mb-6 backdrop-blur-sm">
            Programa de Parcerias
          </span>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto">
            Cresça junto com o maior guia da Zona Norte
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Estamos sempre em busca de mentes criativas, marcas inovadoras e profissionais apaixonados pela gastronomia paulistana para colaborarem com o Menu ZN.
          </p>
        </div>
      </section>

      {/* Programas de Parceria */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 md:py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface">Como podemos colaborar?</h2>
          <p className="mt-4 text-on-surface/70 max-w-2xl mx-auto">
            Não importa se você é um influenciador local ou uma agência de marketing, nós temos espaço para construir projetos incríveis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-outline/20 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-[#fdf8f4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Megaphone className="text-[rgb(148_53_21)]" size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Criadores de Conteúdo</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Você ama explorar restaurantes na ZN e tem uma comunidade engajada? Seja um embaixador do Menu ZN e participe de reviews exclusivas.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-outline/20 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-[#fdf8f4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Camera className="text-[rgb(148_53_21)]" size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Fotógrafos & Audiovisual</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Buscamos profissionais de captação de imagem para produzir materiais de alta qualidade para os nossos estabelecimentos parceiros.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-outline/20 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-[#fdf8f4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Handshake className="text-[rgb(148_53_21)]" size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Marcas & Patrocinadores</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Sua marca quer se conectar com o público da Zona Norte? Criamos ações de co-branding, patrocínio de matérias e eventos.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-3xl p-8 border border-outline/20 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-[#fdf8f4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="text-[rgb(148_53_21)]" size={24} />
            </div>
            <h3 className="font-serif text-xl font-bold mb-3">Agências de Marketing</h3>
            <p className="text-sm text-on-surface/70 leading-relaxed">
              Representa restaurantes da região? Faça uma parceria conosco para garantir condições exclusivas na inclusão dos seus clientes no guia.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[rgb(148_53_21)]/5 border-y border-[rgb(148_53_21)]/10">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 lg:px-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-6">Pronto para dar o próximo passo?</h2>
          <p className="text-on-surface/70 text-lg mb-10 max-w-2xl mx-auto">
            Acreditamos que as melhores parcerias são baseadas em ganho mútuo. Mande uma mensagem contando sobre você ou sua empresa e vamos conversar!
          </p>
          
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="rounded-full bg-[rgb(148_53_21)] hover:bg-[rgb(148_53_21)]/90 text-white px-8 h-14 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-[rgb(148_53_21)]/20 transition-all group">
              Quero ser parceiro
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
