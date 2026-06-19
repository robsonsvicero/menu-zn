import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Bookmark, Share2, Heart, Wine } from 'lucide-react'
import type { Metadata } from 'next'

interface ArticleContent {
  slug: string
  id: string
  tag: string
  category: string
  title: string
  excerpt: string
  image: string
  author: {
    name: string
    role: string
    avatar: string
    bio?: string
  }
  date: string
  readTime: string
  content: React.ReactNode
}

const articleData: Record<string, ArticleContent> = {
  'raphael-zanon': {
    slug: 'raphael-zanon',
    id: 'featured',
    tag: 'PERFIL DO CHEF',
    category: 'RECEITAS',
    title: 'A Reinvenção da Cozinha Regional por Raphael Zanon',
    excerpt: 'Visitamos o novo espaço que está mudando o panorama gastronômico de Santana. Uma experiência que une técnica francesa e ingredientes locais com uma maestria raramente vista fora dos grandes eixos mundiais.',
    image: '/images/hero-blog-destaque.png',
    author: {
      name: 'Helena Silveira',
      role: 'Crítica Gastronômica',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bio: 'Crítica gastronômica e pesquisadora culinária com mais de 15 anos de estrada. Viaja o mundo em busca de histórias que conectam o homem à terra através do paladar.'
    },
    date: '14 de Maio, 2024',
    readTime: '8 min de leitura',
    content: (
      <>
        {/* Paragraph with Drop Cap */}
        <p className="body-m text-on-surface/90 mb-8 leading-[1.8]">
          <span className="float-left text-7xl font-serif text-[#943515] leading-[0.8] pr-2 pt-2">N</span>
          o coração pulsante da gastronomia contemporânea, poucos nomes ressoam com tanta audácia quanto Raphael Zanon. O chef, que trocou as cozinhas estreladas de Paris pelo rústico refinamento das serras brasileiras, propõe um diálogo entre o rigor técnico europeu e a exuberância indomada dos ingredientes locais.
        </p>

        <h3 className="font-serif text-xl md:text-2xl text-[#943515] font-bold mt-12 mb-6">A Essência do Ingrediente</h3>
        
        <p className="body-m text-on-surface/90 mb-8 leading-[1.8]">
          Para Zanon, a reinvenção não nasce da desconstrução, mas da exaltação. Ao caminhar por sua horta orgânica ao amanhecer, ele não busca apenas o frescor, mas a memória. "O ingrediente conta uma história antes mesmo de tocar a panela", afirma o chef enquanto observa uma raiz de mandioca recém-colhida. Sua cozinha é um manifesto contra a pasteurização do paladar global.
        </p>

        <blockquote className="border-l-4 border-[#943515] pl-8 my-12 font-serif italic text-lg md:text-xl text-on-surface/90 bg-[#FAF8F2] py-8 pr-8 rounded-r-2xl shadow-sm">
          "Não estamos apenas servindo comida; estamos traduzindo a terra em sensações. O luxo hoje é a procedência absoluta."
          <cite className="block text-sm font-sans mt-4 text-[#943515] not-italic">— Raphael Zanon</cite>
        </blockquote>

        <p className="body-m text-on-surface/90 mb-8 leading-[1.8]">
          A arquitetura dos pratos reflete sua filosofia. No Menu Degustação "Origens", o tradicional pão de queijo é elevado a uma experiência de texturas e temperaturas, servido com uma mousse de queijo canastra curado por 24 meses e mel de abelhas nativas. É uma provocação sensorial que obriga o comensal a redescobrir o familiar.
        </p>

        <div className="my-12">
          <div className="relative w-full aspect-[2/1] rounded-[24px] overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" 
              alt="O salão do Menu ZN: Minimalismo e natureza em simbiose perfeita." 
              fill 
              className="object-cover"
            />
          </div>
          <p className="text-center text-sm text-on-surface/60 mt-4 font-sans">
            O salão do Menu ZN: Minimalismo e natureza em simbiose perfeita.
          </p>
        </div>

        <h3 className="font-serif text-xl md:text-2xl text-[#943515] font-bold mt-12 mb-6">O Futuro é Regional</h3>
        
        <p className="body-m text-on-surface/90 mb-16 leading-[1.8]">
          O impacto de Zanon extrapola os limites de sua cozinha. Ele lidera um movimento de capacitação de pequenos produtores locais, garantindo que a cadeia produtiva seja tão sofisticada quanto o prato final. Ao final da refeição, o que resta não é apenas a saciedade, mas a compreensão de que a alta gastronomia encontrou seu novo norte na autenticidade regional.
        </p>
      </>
    )
  },
  // Outros artigos continuam como estavam...
  '1': {
    slug: '1',
    id: '1',
    tag: 'RECEITAS',
    category: 'RECEITAS',
    title: 'Aprenda a Costurar Massa de Pão',
    excerpt: 'O Humberto Lisboa realmente põe a mão na massa. Sócio proprietário da Osteria da Onça, mostra como se...',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
    author: {
      name: 'Humberto Lisboa',
      role: 'Padeiro & Sócio da Osteria da Onça',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    date: '14 de Julho, 2024',
    readTime: '6 min de leitura',
    content: (
      <>
        <p className="body-l text-on-surface/90 mb-6 font-serif italic leading-relaxed">
          Dominar a fermentação natural e aprender a manipular o glúten para criar estruturas de alvéolos perfeitas é uma arte. Humberto Lisboa nos ensina as principais dobras de modelagem.
        </p>
        <p className="body-m text-on-surface/85 mb-6 leading-relaxed">
          Fazer pão artesanal é um exercício de paciência e percepção sensorial. Na Osteria da Onça, cada massa é tratada de forma individual, respeitando as variações diárias de temperatura e umidade.
        </p>
      </>
    )
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = articleData[slug] || articleData['raphael-zanon']
  
  return {
    title: `${article.title} | Menu ZN`,
    description: article.excerpt,
  }
}

export default async function BlogPostDetail({ params }: PageProps) {
  const { slug } = await params
  
  // Fallback to raphael-zanon if slug doesn't match
  const article = articleData[slug] || articleData['raphael-zanon']

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] lg:h-[750px] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={article.image} 
            alt={article.title} 
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-16 pb-12 md:pb-16 lg:pb-20">
          <div className="flex flex-col items-start">
            {/* Pill Tag */}
            <span className="bg-[#943515] text-[10px] md:text-xs font-bold tracking-[0.2em] text-white px-4 py-2 rounded-full uppercase mb-4 shadow-md inline-block">
              {article.tag}
            </span>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-5xl lg:text-[52px] leading-[1.15] text-white font-bold max-w-4xl mb-6 tracking-tight drop-shadow-sm">
              {article.title}
            </h1>

            {/* Profile Meta */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/95 text-xs md:text-sm font-sans mt-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <Image 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">Por {article.author.name}</span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="opacity-80" />
                {article.date}
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="opacity-80" />
                {article.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* Left Sidebar Actions (Sticky) */}
          <aside className="hidden md:flex flex-col gap-4 sticky top-32 h-fit pt-2">
            <button 
              className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-on-surface hover:border-[#943515] hover:text-[#943515] transition-colors"
              title="Compartilhar"
            >
              <Share2 size={16} strokeWidth={1.5} />
            </button>
            <button 
              className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-on-surface hover:border-[#943515] hover:text-[#943515] transition-colors"
              title="Salvar artigo"
            >
              <Bookmark size={16} strokeWidth={1.5} />
            </button>
            <button 
              className="w-10 h-10 rounded-full border border-outline flex items-center justify-center text-on-surface hover:border-[#943515] hover:text-[#943515] transition-colors"
              title="Curtir"
            >
              <Heart size={16} strokeWidth={1.5} />
            </button>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 max-w-[700px]">
            
            {/* Mobile Actions (Visible only on mobile) */}
            <div className="flex md:hidden items-center gap-4 mb-10 pb-6 border-b border-outline/30">
              <button className="flex items-center gap-2 text-sm text-on-surface/70 hover:text-[#943515]">
                <Share2 size={16} /> Compartilhar
              </button>
              <button className="flex items-center gap-2 text-sm text-on-surface/70 hover:text-[#943515]">
                <Bookmark size={16} /> Salvar
              </button>
            </div>

            {/* Article Text */}
            <article className="text-[#2f2e2e] font-sans">
              {article.content}
            </article>

            {/* Author Bio Box */}
            <div className="mt-16 py-10 border-y border-outline/30 flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border border-outline/20">
                <Image 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-xl text-on-surface mb-2">{article.author.name}</h4>
                <p className="text-sm text-on-surface/80 leading-relaxed mb-4">
                  {article.author.bio || article.author.role}
                </p>
                <div className="flex gap-4 text-xs font-semibold text-[#943515]">
                  <a href="#" className="hover:underline">Siga no Instagram</a>
                  <a href="#" className="hover:underline">Newsletter</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Posts Section */}
      <section className="bg-[#F4F1EA] py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center font-serif text-2xl text-on-surface mb-12">
            Continue Explorando
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Article Card 1 */}
            <Link href="/blog/coqueteis" className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" 
                  alt="Coquetéis Artesanais" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#943515] text-[10px] font-bold tracking-[0.15em] uppercase mb-4">
                  BEBIDAS
                </span>
                <h3 className="font-serif text-xl leading-snug text-on-surface mb-3 group-hover:text-[#943515] transition-colors">
                  A Nova Era dos Coquetéis Artesanais
                </h3>
                <p className="text-on-surface/60 text-sm leading-relaxed font-sans line-clamp-3">
                  Como ervas locais e destilados esquecidos estão voltando ao...
                </p>
              </div>
            </Link>

            {/* Article Card 2 */}
            <Link href="/blog/padarias" className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800" 
                  alt="Pães Artesanais" 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-[#943515] text-[10px] font-bold tracking-[0.15em] uppercase mb-4">
                  GUIA
                </span>
                <h3 className="font-serif text-xl leading-snug text-on-surface mb-3 group-hover:text-[#943515] transition-colors">
                  Padarias que São Verdadeiros Templos
                </h3>
                <p className="text-on-surface/60 text-sm leading-relaxed font-sans line-clamp-3">
                  Uma curadoria das padarias paulistanas que tratam o trigo com
                </p>
              </div>
            </Link>

            {/* Sommelier Tip Card (Dark) */}
            <div className="bg-[#2D2B2A] rounded-[24px] p-8 flex flex-col text-white shadow-sm">
              <div className="flex items-center gap-2 text-white/80 mb-8">
                <Wine size={18} />
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Dica do Sommelier</span>
              </div>
              <h3 className="font-serif text-xl mb-4 text-white">
                Harmonização: Syrah da Serra
              </h3>
              <p className="text-white/70 text-sm leading-relaxed font-sans mb-8 flex-1">
                Para acompanhar os pratos robustos e terrosos de Raphael Zanon, recomendamos um Syrah de altitude, cujas notas de pimenta preta e frutas negras complementam a intensidade do fogo e da terra.
              </p>
              <Link 
                href="/vinhos" 
                className="w-full text-center py-3.5 px-6 rounded-full border border-white/20 text-sm text-white/90 font-medium hover:bg-white hover:text-[#2D2B2A] transition-all"
              >
                Ver Guia de Vinhos
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
