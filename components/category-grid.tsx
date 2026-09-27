import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Coffee, Droplets, Flower2, Leaf, Pill, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { CATEGORIES } from '@/lib/site'

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'chas-e-infusoes': Coffee,
  'suplementos-naturais': Pill,
  fitoterapia: Leaf,
  'oleos-essenciais': Droplets,
  'cosmeticos-naturais': Sparkles,
  'mel-e-derivados': Flower2,
}

export function CategoryGrid() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(CATEGORIES ?? []).map((c, i) => {
        const Icon = CATEGORY_ICONS[c.slug] ?? Leaf
        return (
          <li key={c.slug}>
            <Reveal delay={i * 0.07}>
              <Link
                href={`/produtos#${c.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted shadow-soft transition-shadow duration-300 hover:shadow-lift"
              >
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="flex items-center justify-between text-2xl font-semibold text-white">
                    {c.name}
                    <ArrowUpRight
                      className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-1 text-sm text-white/85">{c.short}</p>
                </div>
              </Link>
            </Reveal>
          </li>
        )
      })}
    </ul>
  )
}
