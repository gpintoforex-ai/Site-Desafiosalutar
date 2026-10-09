import type { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, Compass, HeartHandshake, Leaf, Recycle, Users } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { CtaBand } from '@/components/cta-band'
import { IMAGES, SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Quem Somos',
  description: 'Conheça a Ervanária Desafio Salutar: a nossa história, os nossos valores e a forma como aconselhamos quem nos visita.',
  alternates: { canonical: '/quem-somos' },
}

const VALUES = [
  { icon: Leaf, title: 'Natureza', text: 'Privilegiamos produtos de origem natural, com composição clara e rastreável.' },
  { icon: BookOpen, title: 'Conhecimento', text: 'Formamo-nos continuamente para aconselhar com rigor e responsabilidade.' },
  { icon: HeartHandshake, title: 'Proximidade', text: 'Cada visita é uma conversa: ouvimos, explicamos e respeitamos o seu ritmo.' },
  { icon: Recycle, title: 'Sustentabilidade', text: 'Valorizamos marcas com práticas responsáveis e embalagens mais sustentáveis.' },
]

const STEPS = [
  { icon: Users, title: 'Ouvimos', text: 'Começamos por perceber as suas necessidades e preferências.' },
  { icon: Compass, title: 'Orientamos', text: 'Apresentamos as opções mais adequadas e explicamos como utilizá-las.' },
  { icon: HeartHandshake, title: 'Acompanhamos', text: 'Estamos disponíveis para esclarecer dúvidas sempre que precisar.' },
]

export default function QuemSomosPage() {
  return (
    <>
      <PageHero
        eyebrow="Quem Somos"
        title="Produtos naturais, com cuidado e proximidade"
        subtitle="Uma ervanária de bairro onde tradição, conhecimento e atenção se encontram."
        image={IMAGES.hero2}
        alt="Frascos de vidro numa prateleira de ervanária"
      />

      <section className="px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="A nossa história" title={`Uma história desde ${SITE.foundingYear}`} />
            <Reveal delay={0.1} className="mt-6 space-y-4 text-base leading-relaxed text-foreground/85">
              <p>
                A {SITE.name} existe desde {SITE.foundingYear}. Em Pombal, é um espaço dedicado à sua saúde e bem-estar,
                com produtos de origem natural e aconselhamento em medicina integrativa, centrado no bem-estar e na suplementação. Ao longo dos anos, tornou-se um ponto
                de referência para quem procura alternativas naturais para o seu dia-a-dia.
              </p>
              <p>
                Desde então, mantemos a mesma essência: uma loja física acolhedora, uma seleção cuidada de produtos e uma equipa
                que gosta de conversar, explicar e aconselhar.
              </p>
            </Reveal>
          </div>
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-lift">
            <Image src={IMAGES.about} alt="Balcão e prateleiras de produtos naturais da ervanária" fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading center eyebrow="Os nossos valores" title="Aquilo em que acreditamos" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="h-full rounded-lg bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <v.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-primary">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 md:py-24">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading center eyebrow="Como aconselhamos" title="Um acompanhamento em três passos" />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.1} className="h-full">
                  <div className="relative h-full rounded-lg bg-secondary p-7 shadow-sm">
                    <span className="absolute right-5 top-4 font-display text-5xl font-semibold text-accent/40" aria-hidden="true">
                      {i + 1}
                    </span>
                    <s.icon className="h-8 w-8 text-leaf" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-semibold text-primary">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground">
              O nosso aconselhamento não substitui o diagnóstico nem o acompanhamento de um médico ou de outro profissional
              de saúde. Em caso de doença, gravidez, amamentação ou medicação, consulte sempre o seu médico.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
