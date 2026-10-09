import Image from 'next/image'
import Link from 'next/link'
import { MapPin, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { IMAGES, SITE } from '@/lib/site'

export function CtaBand() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <Reveal className="relative mx-auto max-w-[1200px] overflow-hidden rounded-xl bg-primary shadow-lift">
        <Image src={IMAGES.contact} alt="Interior da ervanária" fill sizes="1200px" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/50" />
        <div className="relative flex flex-col items-start gap-6 px-6 py-14 sm:px-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
              Tem dúvidas? Estamos aqui para ajudar.
            </h2>
            <p className="mt-3 text-primary-foreground/85">
              Visite a nossa loja ou envie-nos uma mensagem — teremos todo o gosto em aconselhá-lo pessoalmente.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-soft transition hover:-translate-y-0.5 hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> Falar pelo WhatsApp
              <span className="sr-only"> (abre numa nova janela)</span>
            </a>
            <Link
              href="/contactos#localizacao"
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary-foreground/25"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" /> Como chegar
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
