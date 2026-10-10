import type { Metadata } from 'next'
import { Globe2, Info, Tag } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { BrandMark } from '@/components/brand-mark'
import { CtaBand } from '@/components/cta-band'
import { BRANDS, IMAGES } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Marcas Representadas',
  description: 'As marcas de produtos naturais, fitoterapia, suplementos e cosmética natural que pode encontrar na Ervanária Desafio Salutar.',
  alternates: { canonical: '/marcas' },
}

export default function MarcasPage() {
  return (
    <>
      <PageHero
        eyebrow="Marcas"
        title="Representamos as principais marcas de suplementos"
        subtitle="Trabalhamos com marcas de referência em produtos naturais e suplementação alimentar, garantindo qualidade e confiança em cada aconselhamento."
        image={IMAGES.hero3}
        alt="Produtos naturais sobre uma bancada"
      />

      <section className="px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            eyebrow="Parceiros"
            title="As nossas marcas"
            text="Cada marca foi escolhida pela seriedade das suas fórmulas. Pergunte-nos por outras referências — teremos todo o gosto em ajudar."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.map((b, i) => (
              <li key={b.name}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <article className={`flex h-full flex-col rounded-lg p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift ${i % 2 === 0 ? 'bg-card' : 'bg-cream'}`}>
                    <div className="flex items-center justify-center rounded-md bg-white p-4">
                      <BrandMark brand={b} size="lg" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold text-primary">{b.name}</h3>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-medium text-primary">
                        <Tag className="h-3 w-3" aria-hidden="true" /> {b.focus}
                      </span>
                      {b.origin && <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 font-medium text-primary">
                        <Globe2 className="h-3 w-3" aria-hidden="true" /> {b.origin}
                      </span>}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-foreground/80">{b.description}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
          <Reveal>
            <p className="mt-10 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Os nomes e marcas referidos pertencem aos respetivos titulares e são apresentados apenas para identificar os
              produtos disponíveis na loja. A disponibilidade pode variar.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
