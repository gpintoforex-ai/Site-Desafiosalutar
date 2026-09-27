import { BrandMark } from '@/components/brand-mark'
import { BRANDS } from '@/lib/site'

export function BrandsMarquee() {
  const list = [...(BRANDS ?? []), ...(BRANDS ?? [])]
  return (
    <div className="pause-on-hover relative overflow-hidden py-2" aria-label="Marcas representadas">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <ul className="animate-marquee flex w-max gap-5">
        {list.map((b, i) => (
          <li
            key={`${b.name}-${i}`}
            aria-hidden={i >= (BRANDS?.length ?? 0) ? true : undefined}
            className="flex items-center rounded-lg bg-card px-8 py-5 shadow-soft transition-shadow hover:shadow-lift"
          >
            <BrandMark brand={b} />
          </li>
        ))}
      </ul>
    </div>
  )
}
