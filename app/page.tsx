import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Store } from 'lucide-react'
import { HeroCarousel } from '@/components/hero-carousel'
import { CategoryGrid } from '@/components/category-grid'
import { SectionHeading } from '@/components/section-heading'
import { BrandsMarquee } from '@/components/brands-marquee'
import { CtaBand } from '@/components/cta-band'
import { Reveal } from '@/components/reveal'
import { CountUp } from '@/components/count-up'
import { BRANDS, CATEGORIES, IMAGES, SITE } from '@/lib/site'

const VALUES = [
  { icon: Leaf, title: 'Seleção rigorosa', text: 'Escolhemos cada produto pela qualidade, origem e composição.' },
  { icon: HeartHandshake, title: 'Aconselhamento próximo', text: 'Ouvimos com atenção e orientamos com responsabilidade.' },
  { icon: ShieldCheck, title: 'Marcas de confiança', text: 'Trabalhamos com marcas reconhecidas no setor natural.' },
]

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      {/* Valores */}
      <section className="relative z-10 -mt-12 px-4 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] gap-4 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="flex h-full gap-4 rounded-lg bg-card p-6 shadow-soft transition-shadow hover:shadow-lift">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-leaf">
                  <v.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-primary">{v.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="px-4 py-20 sm:px-6 md:py-24" aria-labelledby="categorias">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="O que encontra na nossa loja"
              title="Categorias de produtos"
              text="Seis universos de produtos naturais, reunidos numa loja física onde pode ver, perguntar e escolher com calma."
            />
            <Reveal>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-muted"
              >
                Ver todas as categorias <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Quem Somos */}
      <section className="bg-cream px-4 py-20 sm:px-6 md:py-24" aria-labelledby="sobre">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-lift">
              <Image
                src={IMAGES.about}
                alt="Interior acolhedor da ervanária com balcão e produtos naturais"
                fill
                sizes="(min-width:1024px) 560px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-lg bg-primary p-5 text-primary-foreground shadow-lift sm:right-8">
              <p className="font-display text-3xl font-semibold">Loja física</p>
              <p className="text-sm text-primary-foreground/80">Aconselhamento presencial</p>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Quem Somos"
              title="Um espaço dedicado ao bem-estar natural"
              text={`Desde ${SITE.foundingYear}, a Ervanária Desafio Salutar, em Pombal, une o saber tradicional das plantas a um aconselhamento próximo. Selecionamos cada produto com rigor e recebemos cada pessoa com tempo e atenção.`}
            />
            <Reveal delay={0.1}>
              <dl className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-card p-4 text-center shadow-soft">
                  <dt className="text-xs text-muted-foreground">Categorias</dt>
                  <dd className="font-display text-3xl font-semibold text-primary">
                    <CountUp to={CATEGORIES?.length ?? 0} />
                  </dd>
                </div>
                <div className="rounded-lg bg-card p-4 text-center shadow-soft">
                  <dt className="text-xs text-muted-foreground">Marcas</dt>
                  <dd className="font-display text-3xl font-semibold text-primary">
                    <CountUp to={BRANDS?.length ?? 0} />
                  </dd>
                </div>
                <div className="rounded-lg bg-card p-4 text-center shadow-soft">
                  <dt className="text-xs text-muted-foreground">Desde</dt>
                  <dd className="font-display text-3xl font-semibold text-primary">{SITE.foundingYear}</dd>
                </div>
              </dl>
              <Link
                href="/quem-somos"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-leaf hover:shadow-lift"
              >
                Conheça-nos melhor <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="px-4 py-20 sm:px-6 md:py-24" aria-labelledby="marcas">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-10">
            <SectionHeading
              center
              eyebrow="Marcas representadas"
              title="Representamos as principais marcas de suplementos"
              text="Trabalhamos com marcas de referência em produtos naturais e suplementação alimentar, garantindo qualidade e confiança em cada aconselhamento."
            />
          </div>
          <BrandsMarquee />
          <div className="mt-10 text-center">
            <Link
              href="/marcas"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 font-semibold text-primary shadow-sm transition hover:bg-muted"
            >
              <Store className="h-4 w-4" aria-hidden="true" /> Ver todas as marcas
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
