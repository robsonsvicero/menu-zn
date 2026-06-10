import Hero from '@/components/sections/Hero'
import StatsBar from '@/components/sections/StatsBar'
import Highlights from '@/components/sections/Highlights'
import Categories from '@/components/sections/Categories'
import Showcase from '@/components/sections/Showcase'
import CtaAdvertise from '@/components/sections/CtaAdvertise'
import EditorPicks from '@/components/sections/EditorPicks'

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Highlights />
      <Categories />
      <Showcase />
      <CtaAdvertise />
      <EditorPicks />
    </main>
  )
}