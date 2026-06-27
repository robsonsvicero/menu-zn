import type { Metadata } from "next";
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Perguntas Frequentes (FAQ) | Menu Zona Norte",
  description:
    "Tire suas dúvidas sobre o Menu Zona Norte, planos de anúncio, curadoria e parcerias. Central de Ajuda oficial do maior guia gastronômico da ZN.",
};

const whatsappUrl = "https://w.app/xkvhoo";

const faqs = [
  {
    question: "Como faço para incluir meu restaurante no guia?",
    answer:
      "A inclusão no Menu Zona Norte pode ser feita através de nossa avaliação editorial ou através da contratação de um dos nossos planos comerciais. Para mais detalhes, acesse a página de 'Planos e Preços' ou entre em contato pelo nosso WhatsApp.",
  },
  {
    question: "O Menu Zona Norte avalia restaurantes?",
    answer:
      "Sim! Nossa equipe editorial visita periodicamente estabelecimentos na região para manter a curadoria ativa. Restaurantes que recebem o 'Selo de Curadoria' foram testados e aprovados pela nossa equipe de forma independente.",
  },
  {
    question: "Qual é a diferença entre o Plano Bronze e o Prata?",
    answer:
      "O Plano Bronze é focado em marcar presença digital (perfil básico, fotos e endereço). Já o Plano Prata, que é o nosso plano recomendado, oferece destaque nas buscas, selo de parceiro, postagem no nosso Instagram e prioridade de ranqueamento nas categorias.",
  },
  {
    question: "Posso cancelar meu plano a qualquer momento?",
    answer:
      "Nossos planos funcionam no modelo de assinatura com períodos de fidelidade de 3, 6 ou 12 meses, dependendo da negociação. Após esse período, o cancelamento pode ser feito sem multas, mediante aviso prévio.",
  },
  {
    question: "Sou influenciador(a). Como faço para fechar parceria?",
    answer:
      "Nós amamos colaborar com criadores de conteúdo locais! Temos a página 'Seja Parceiro' dedicada a isso. Mande-nos uma mensagem com seu media kit e suas ideias pelo WhatsApp e retornaremos o mais breve possível.",
  },
  {
    question: "Como funciona o destaque na Home (Plano Ouro)?",
    answer:
      "O Plano Ouro reserva espaços premium na página inicial do site, garantindo que seu estabelecimento seja uma das primeiras coisas que os usuários vêem ao acessar o Menu ZN. Além disso, incluímos matérias exclusivas e produção de conteúdo em vídeo (Reels).",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-on-surface pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-menuzn.png" alt="Menu ZN FAQ" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative mx-auto max-w-5xl px-6 py-28 md:px-10 lg:px-12 md:py-36 text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-[rgb(148_53_21)]/20 backdrop-blur-md flex items-center justify-center border border-white/10">
              <HelpCircle size={28} className="text-[rgb(214_152_105)]" />
            </div>
          </div>
          <h1 className="font-serif text-4xl leading-tight md:text-5xl font-bold mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Como podemos te ajudar? Encontre abaixo as respostas para as dúvidas mais comuns sobre o nosso guia e nossas parcerias.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mx-auto max-w-3xl px-6 py-16 md:px-10 lg:px-12 relative -mt-10 z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-outline/20">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-outline/30 bg-[#faf8f5] rounded-2xl overflow-hidden open:bg-white open:border-[rgb(148_53_21)]/30 transition-all duration-300"
              >
                <summary className="flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer list-none select-none">
                  <h3 className="font-serif text-lg font-bold text-on-surface group-open:text-[rgb(148_53_21)] transition-colors">
                    {faq.question}
                  </h3>
                  <div className="w-8 h-8 shrink-0 rounded-full bg-white border border-outline/30 flex items-center justify-center group-open:bg-[rgb(148_53_21)] group-open:border-[rgb(148_53_21)] transition-colors">
                    <ChevronDown size={16} className="text-on-surface/50 group-open:text-white group-open:rotate-180 transition-transform duration-300" />
                  </div>
                </summary>
                <div className="px-5 pb-6 md:px-6 md:pb-8 text-on-surface/70 leading-relaxed text-sm md:text-base border-t border-outline/10">
                  <p className="pt-4">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help CTA */}
      <section className="mx-auto max-w-4xl px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-[rgb(148_53_21)]/5 rounded-full mb-6">
          <MessageCircle size={24} className="text-[rgb(148_53_21)]" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl text-on-surface mb-4">Ainda com dúvidas?</h2>
        <p className="text-on-surface/70 mb-8 max-w-xl mx-auto">
          Não encontrou o que procurava? Nosso time de atendimento está à disposição no WhatsApp para responder qualquer outra pergunta.
        </p>
        
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="rounded-full bg-[rgb(148_53_21)] hover:bg-[rgb(148_53_21)]/90 text-white px-8 h-12 text-xs font-bold uppercase tracking-[0.2em] shadow-md">
            Falar no WhatsApp
          </Button>
        </a>
      </section>
    </main>
  );
}
