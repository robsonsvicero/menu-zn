import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import StatsBar from '@/components/sections/StatsBar'
import Highlights from '@/components/sections/Highlights'
import Categories from '@/components/sections/Categories'
import Showcase from '@/components/sections/Showcase'
import CtaAdvertise from '@/components/sections/CtaAdvertise'
import Chronicles from '@/components/sections/Chronicles'
// import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  verification: {
    google: '73v2l6hFjaAyRm-SSSsw4g72yMvmyS5x1Xkze8paeHs',
  },
}

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Highlights />
      <Categories />
      <Showcase />
      {/* <CtaAdvertise /> */}
      <Chronicles />
      {/* <Testimonials /> */}
      <Newsletter />
    </main>
  )
}