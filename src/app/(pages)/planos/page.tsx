import type { Metadata } from "next";
import { Check, Star, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Planos para Empresas | Menu Zona Norte",
  description:
    "Descubra nossos planos para divulgar o seu estabelecimento na Zona Norte de São Paulo. Conecte-se com um público apaixonado por gastronomia.",
};

const whatsappUrl = "https://wa.me/5511973237060";

export default function PlanosPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-menuzn.png" alt="Menu ZN" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:px-10 lg:px-12 md:py-40 text-center text-white">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white mb-6 backdrop-blur-sm">
            Para Estabelecimentos
          </span>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto">
            Coloque seu negócio no mapa gastronômico da Zona Norte
          </h1>
          <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Faça parte da vitrine mais seleta da região. Conecte sua marca a um público qualificado que busca as melhores experiências gastronômicas todos os dias.
          </p>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 md:py-24 relative -mt-6 md:-mt-4 z-10">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* PLANO BRONZE */}
          <div className="rounded-[32px] border border-outline/20 bg-white p-8 md:p-10 shadow-sm transition-transform hover:-translate-y-1">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-bold text-on-surface">Plano Bronze</h3>
              <p className="text-sm text-on-surface/60 mt-2 h-10">
                O essencial para marcar sua presença digital.
              </p>
            </div>
            
            <div className="space-y-4 mb-8 min-h-[220px]">
              <ul className="space-y-4 text-sm text-on-surface/80">
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#a8a8a8] shrink-0 mt-0.5" />
                  <span>Perfil exclusivo da empresa</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#a8a8a8] shrink-0 mt-0.5" />
                  <span>Galeria de Fotos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#a8a8a8] shrink-0 mt-0.5" />
                  <span>Botão direto para WhatsApp</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#a8a8a8] shrink-0 mt-0.5" />
                  <span>Endereço e mapa</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[#a8a8a8] shrink-0 mt-0.5" />
                  <span>Link para Instagram</span>
                </li>
              </ul>
            </div>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full rounded-2xl h-14 text-sm uppercase tracking-wider font-bold text-on-surface border-outline/40 hover:bg-[#faf8f5] hover:text-[rgb(148_53_21)] transition-colors">
                Consultar Valor
              </Button>
            </a>
          </div>

          {/* PLANO PRATA (RECOMENDADO) */}
          <div className="rounded-[32px] border-2 border-[rgb(148_53_21)] bg-white p-8 md:p-10 shadow-xl relative transform md:-translate-y-4 transition-transform hover:-translate-y-6">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[rgb(148_53_21)] text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 shadow-md">
              <Star size={12} className="fill-white" />
              Recomendado
            </div>
            
            <div className="mb-6 pt-2">
              <h3 className="font-serif text-3xl font-bold text-[rgb(148_53_21)]">Plano Prata</h3>
              <p className="text-sm text-on-surface/70 mt-2 h-10">
                A melhor estratégia de visibilidade e custo-benefício.
              </p>
            </div>
            
            <div className="space-y-4 mb-8 min-h-[220px]">
              <ul className="space-y-4 text-sm text-on-surface/80">
                <li className="flex items-start gap-3 font-semibold text-[rgb(148_53_21)]">
                  <Check size={18} className="text-[rgb(148_53_21)] shrink-0 mt-0.5" />
                  <span>Tudo do Plano Bronze, e mais:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[rgb(148_53_21)] shrink-0 mt-0.5" />
                  <span>Destaque na sua categoria</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[rgb(148_53_21)] shrink-0 mt-0.5" />
                  <span>Prioridade nas buscas internas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[rgb(148_53_21)] shrink-0 mt-0.5" />
                  <span>Selo Parceiro Menu Zona Norte</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[rgb(148_53_21)] shrink-0 mt-0.5" />
                  <span>1 postagem exclusiva no Instagram</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-[rgb(148_53_21)] shrink-0 mt-0.5" />
                  <span>Inclusão em matérias especiais do blog</span>
                </li>
              </ul>
            </div>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full rounded-2xl h-14 bg-[rgb(148_53_21)] hover:bg-[rgb(148_53_21)]/90 text-sm uppercase tracking-wider font-bold text-white shadow-lg shadow-[rgb(148_53_21)]/20 transition-all">
                Falar com Consultor
              </Button>
            </a>
          </div>

          {/* PLANO OURO */}
          <div className="rounded-[32px] border border-outline/20 bg-[#121212] p-8 md:p-10 shadow-lg text-white transition-transform hover:-translate-y-1">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-[#D69869]" />
                <h3 className="font-serif text-2xl font-bold text-white">Plano Ouro</h3>
              </div>
              <p className="text-sm text-white/60 h-10">
                Poder máximo. Domine o radar gastronômico da região.
              </p>
            </div>
            
            <div className="space-y-4 mb-8 min-h-[220px]">
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3 font-semibold text-[#D69869]">
                  <Check size={18} className="text-[#D69869] shrink-0 mt-0.5" />
                  <span>Tudo do Plano Prata, absoluto:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-white/60 shrink-0 mt-0.5" />
                  <span>Super Destaque na Home do site</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-white/60 shrink-0 mt-0.5" />
                  <span>Matéria exclusiva no nosso editorial</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-white/60 shrink-0 mt-0.5" />
                  <span>Produção de 1 Reel profissional</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={18} className="text-white/60 shrink-0 mt-0.5" />
                  <span>Divulgação maciça em todas as redes</span>
                </li>
              </ul>
            </div>
            
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full rounded-2xl h-14 bg-white hover:bg-white/90 text-[#121212] text-sm uppercase tracking-wider font-bold transition-colors">
                Descobrir Condições
              </Button>
            </a>
          </div>

        </div>
      </section>

      {/* FAQ or Extra info snippet */}
      <section className="mx-auto max-w-4xl px-6 pb-20 md:px-10 lg:px-12 text-center">
        <h3 className="font-serif text-2xl md:text-3xl mb-4 text-on-surface">Ainda tem dúvidas?</h3>
        <p className="text-on-surface/70 mb-8 max-w-2xl mx-auto">
          Nosso time está pronto para analisar o perfil do seu estabelecimento e sugerir a melhor estratégia para atrair clientes. Entre em contato sem compromisso.
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 font-bold text-[rgb(148_53_21)] hover:opacity-80 transition-opacity">
          Chamar no WhatsApp <ArrowRight size={16} />
        </a>
      </section>
    </main>
  );
}
