import Image from "next/image";

export default function AboutZonaNorte() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="flex flex-col gap-10">
          {/* Decorative Image */}
          <div className="relative aspect-[21/9] w-full rounded-[32px] overflow-hidden shadow-xl">
            <Image
              src="/images/hero-zonanorte.png"
              alt="Alta Gastronomia na Zona Norte de São Paulo"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[rgb(148_53_21)]/10 mix-blend-multiply" />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[rgb(148_53_21)] leading-tight text-center md:text-left">
              ALTA GASTRONOMIA ZONA NORTE - SP
            </h2>
            
            <div className="space-y-4 text-on-surface/80 leading-relaxed font-light text-lg">
              <p>
                A Zona Norte de São Paulo vive uma nova fase na gastronomia. A região vem se consolidando como um dos principais polos de restaurantes, bares e experiências gastronômicas da cidade, reunindo desde casas tradicionais até projetos contemporâneos que valorizam cozinha autoral, ambientes bem pensados e novas formas de comer e beber bem.
              </p>
              
              <p>
                O <strong>Menu ZN</strong> é um guia gastronômico da Zona Norte de São Paulo criado para mapear e destacar os melhores restaurantes, bares, rooftops, adegas, hamburguerias artesanais e experiências gastronômicas da região. Mais do que uma lista, é uma curadoria editorial que observa qualidade, consistência, identidade e experiência como critérios principais de seleção.
              </p>
              
              <p>
                Aqui você encontra os melhores restaurantes da Zona Norte SP, bares na Zona Norte de São Paulo e novidades da cena gastronômica local, sempre com um olhar atento para lugares que se destacam pelo conjunto da obra: comida, ambiente, serviço e proposta.
              </p>
              
              <p>
                A proposta do Menu ZN é acompanhar a evolução da gastronomia na Zona Norte de São Paulo, registrando movimentos, tendências, inaugurações e destaques que ajudam a revelar a força criativa da região. De casas de bairro reinventadas a restaurantes contemporâneos, passando por bares autorais e espaços voltados à experiência, tudo faz parte desse recorte vivo da cidade.
              </p>
              
              <p>
                Além de descobrir onde comer na Zona Norte de SP, o leitor também encontra informações atualizadas sobre eventos gastronômicos, promoções, horários de funcionamento e destaques da semana.
              </p>
              
              <p>
                O Menu ZN acompanha a transformação da Zona Norte em um dos destinos gastronômicos mais interessantes de São Paulo, conectando pessoas a experiências que vão muito além da refeição. Comer bem aqui é também uma forma de explorar a cidade com mais profundidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
