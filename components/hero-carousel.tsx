'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { IMAGES, SITE } from '@/lib/site'

const SLIDES = [
  {
    title: 'A natureza ao serviço da sua saúde',
    subtitle: 'Produtos naturais selecionados com rigor para o seu bem-estar',
    image: IMAGES.hero1,
    alt: 'Interior da ervanária com prateleiras de produtos naturais e suplementos',
    cta: { href: '/produtos', label: 'Conhecer os produtos' },
  },
  {
    title: 'Tradição e conhecimento',
    subtitle: 'Décadas de experiência ao seu dispor',
    image: IMAGES.hero2,
    alt: 'Aconselhamento personalizado ao balcão da ervanária',
    cta: { href: '/quem-somos', label: 'A nossa história' },
  },
  {
    title: 'Venha visitar-nos',
    subtitle: 'A nossa equipa está pronta para o aconselhar',
    image: IMAGES.hero3,
    alt: 'Montra de produtos naturais, suplementos e chás em prateleira',
    cta: { href: '/contactos', label: 'Onde estamos' },
  },
]

const INTERVAL = 6500

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const total = SLIDES.length
  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total])

  useEffect(() => {
    if (paused || userPaused) return
    const t = setInterval(() => setIndex((i) => (i + 1) % total), INTERVAL)
    return () => clearInterval(t)
  }, [paused, userPaused, total])

  const slide = SLIDES[index] ?? SLIDES[0]

  return (
    <section
      ref={ref}
      aria-roledescription="carrossel"
      aria-label="Destaques da Ervanária"
      className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <motion.div className="absolute inset-0 -top-[10%] h-[120%]" style={{ y: imgY }}>
            <Image src={slide?.image ?? ''} alt={slide?.alt ?? ''} fill priority={index === 0} sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-[1200px] items-center px-4 sm:px-6">
        <div className="max-w-2xl" aria-live={paused || userPaused ? 'polite' : 'off'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              role="group"
              aria-roledescription="diapositivo"
              aria-label={`${index + 1} de ${total}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur">
                {SITE.name}
              </span>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {slide?.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-white/90 sm:text-xl">{slide?.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={slide?.cta?.href ?? '/'}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-lift transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  {slide?.cta?.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/contactos"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/25"
                >
                  Fale Connosco
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2" role="tablist" aria-label="Escolher diapositivo">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir para o diapositivo ${i + 1}: ${s.title}`}
              onClick={() => go(i)}
              className={`h-2.5 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-accent' : 'w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-label={userPaused ? 'Retomar rotação automática' : 'Pausar rotação automática'}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
          >
            {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Diapositivo anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Diapositivo seguinte"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
