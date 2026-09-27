import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Info, Leaf, MessageCircle, Store } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { CATEGORY_ICONS } from '@/components/category-grid'
import { CtaBand } from '@/components/cta-band'
import { CATEGORIES, IMAGES } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Produtos',
  description:
    'Conheça as categorias de produtos naturais disponíveis na nossa loja física: chás e infusões, suplementos, fitoterapia, óleos essenciais, cosméticos naturais e mel.',
  alternates: { canonical: '/produtos' },
}

export default function ProdutosPage() {
  return (
    <>
      <PageHero
        eyebrow="Produtos"
        title="O que encontra na nossa loja"
        subtitle="Uma visão geral das categorias de produtos naturais disponíveis na nossa loja física."
        image={IMAGES.hero1}
        alt="Ervas frescas sobre uma superfície de madeira"
      />

      <section className="px-4 pt-12 sm:px-6">
        <Reveal className="mx-auto max-w-[1200px]">
          <div
            role="note"
            aria-label="Aviso: sem loja online"
            className="flex flex-col gap-4 rounded-lg bg-accent/20 p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Store className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-primary">Não dispomos de loja online. Visite-nos ou contacte-nos.</p>
                <p className="mt-1 text-sm text-foreground/80">
                  Esta página é meramente informativa. A disponibilidade dos produtos pode variar — contacte-nos para
                  confirmar.
                </p>
              </div>
            </div>
            <Link
              href="/contactos"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-leaf"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Contactar
            </Link>
          </div>
        </Reveal>
      </section>

      <nav aria-label="Categorias" className="sticky top-20 z-30 mt-8 bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
        <ul className="scrollbar-none mx-auto flex max-w-[1200px] gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <a
                href={`#${c.slug}`}
                className="block whitespace-nowrap rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary transition hover:bg-accent hover:text-accent-foreground"
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-[1200px] space-y-8 py-8">
          {CATEGORIES.map((c, i) => {
            const Icon = CATEGORY_ICONS[c.slug] ?? Leaf
            const reverse = i % 2 === 1
            return (
              <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-titulo`} className="scroll-mt-40">
                <Reveal>
                  <div className={`grid items-center gap-8 overflow-hidden rounded-xl p-4 shadow-soft sm:p-6 md:grid-cols-2 ${i % 2 === 0 ? 'bg-card' : 'bg-cream'}`}>
                    <div className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-muted ${reverse ? 'md:order-2' : ''}`}>
                      <Image src={c.image} alt={c.alt} fill sizes="(min-width:768px) 560px, 100vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="p-2 md:p-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-leaf">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h2 id={`${c.slug}-titulo`} className="mt-4 text-3xl font-semibold tracking-tight text-primary">
                        {c.name}
                      </h2>
                      <p className="mt-3 leading-relaxed text-foreground/85">{c.description}</p>
                      <h3 className="mt-6 font-sans text-sm font-semibold uppercase tracking-wider text-leaf">Poderá encontrar</h3>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {(c.examples ?? []).map((ex) => (
                          <li key={ex} className="flex items-start gap-2 text-sm text-foreground/85">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" /> {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              </section>
            )
          })}

          <Reveal>
            <div className="flex gap-3 rounded-lg bg-secondary p-5 text-sm text-foreground/80">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />
              <p>
                Os produtos naturais e suplementos alimentares não substituem um regime alimentar variado e equilibrado, um
                modo de vida saudável, nem o aconselhamento médico. Em caso de gravidez, amamentação, doença ou toma de
                medicação, consulte o seu médico ou farmacêutico antes de utilizar qualquer produto.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <CtaBand />
    </>
  )
}
