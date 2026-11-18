import { fetchPublishedEstablishments } from '@/lib/establishments-public'
import ShowcaseCard from './ShowcaseCard'

export default async function Showcase() {
  const items = await fetchPublishedEstablishments({ indicatedOnly: true, sort: 'random', limit: 6 })

  if (items.length === 0) return null

  return (
    <section className="w-full bg-transparent py-16 px-6 md:px-16 lg:px-[120px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 md:gap-0">
        <div>
          <h2 className="font-serif text-4xl md:text-[44px] text-on-surface font-bold">
            Indicações
          </h2>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
