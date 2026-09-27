import type { Metadata } from 'next'
import { Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { ContactForm } from '@/components/contact-form'
import { MapEmbed } from '@/components/map-embed'
import { IMAGES, SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contactos',
  description: 'Contacte a Ervanária Desafio Salutar: morada, telefone, email, horário e formulário de contacto.',
  alternates: { canonical: '/contactos' },
}

export default function ContactosPage() {
  return (
    <>
      <PageHero
        eyebrow="Contactos"
        title="Fale connosco"
        subtitle="Envie-nos uma mensagem ou visite-nos — teremos todo o gosto em aconselhá-lo."
        image={IMAGES.contact}
        alt="Entrada acolhedora da ervanária com prateleiras de produtos"
      />

      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Reveal>
              <div className="rounded-lg bg-card p-6 shadow-soft">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <MapPin className="h-5 w-5 text-leaf" aria-hidden="true" /> Morada
                </h2>
                <address className="mt-2 not-italic text-foreground/85">
                  {SITE.name}
                  <br />
                  {SITE.address}
                  <br />
                  {SITE.postalCode} {SITE.city}
                </address>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-lg bg-card p-6 shadow-soft">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Phone className="h-5 w-5 text-leaf" aria-hidden="true" /> Telefone
                </h2>
                <a href={SITE.phoneHref} className="mt-2 block text-lg font-medium text-foreground hover:text-leaf">
                  <span suppressHydrationWarning>{SITE.phone}</span>
                </a>
                <p className="mt-1 text-xs text-muted-foreground">{SITE.phoneCostNote} (DL n.º 59/2021).</p>
                <a href={SITE.mobilePhoneHref} className="mt-3 block text-lg font-medium text-foreground hover:text-leaf">
                  <span suppressHydrationWarning>{SITE.mobilePhone}</span>
                </a>
                <p className="mt-1 text-xs text-muted-foreground">{SITE.mobilePhoneCostNote} (DL n.º 59/2021).</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-lg bg-card p-6 shadow-soft">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Mail className="h-5 w-5 text-leaf" aria-hidden="true" /> Email
                </h2>
                <a href={`mailto:${SITE.email}`} className="mt-2 block break-all font-medium text-foreground hover:text-leaf">
                  <span suppressHydrationWarning>{SITE.email}</span>
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-lg bg-cream p-6 shadow-soft">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Clock className="h-5 w-5 text-leaf" aria-hidden="true" /> Horário
                </h2>
                <dl className="mt-3 space-y-2 text-sm">
                  {SITE.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt className="text-foreground/80">{h.days}</dt>
                      <dd className="font-semibold text-primary">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight text-primary">Envie-nos uma mensagem</h2>
              <p className="mb-6 mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
                Os seus dados são tratados conforme o RGPD e a legislação nacional.
              </p>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="localizacao" className="scroll-mt-24 bg-cream px-4 py-16 sm:px-6 md:py-20" aria-labelledby="localizacao-titulo">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 id="localizacao-titulo" className="mb-6 text-3xl font-semibold tracking-tight text-primary">
              Como chegar
            </h2>
          </Reveal>
          <Reveal>
            <MapEmbed />
          </Reveal>
        </div>
      </section>
    </>
  )
}
