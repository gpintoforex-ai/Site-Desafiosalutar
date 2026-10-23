import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { LegalLayout } from '@/components/legal-layout'
import { CookiesPolicyContent } from '@/components/cookies-policy-content'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Cookies e tecnologias semelhantes utilizados pela Ervanária Desafio Salutar e como aceitar, recusar ou retirar o consentimento.',
  alternates: { canonical: '/politica-cookies' },
}

export default function PoliticaCookiesPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Política de Cookies" subtitle="Conheça as tecnologias utilizadas no site e como gerir as suas preferências.">
        <p className="mt-6 text-sm text-primary-foreground/75">Última atualização: 23 de outubro de 2026</p>
      </PageHero>
      <LegalLayout animate={false} toc={[{ id: 'utilizacao', label: 'Cookies e preferências' }, { id: 'contactos', label: 'Responsável e contactos' }]}>
        <section id="utilizacao">
          <h2>Cookies e tecnologias semelhantes</h2>
          <CookiesPolicyContent />
        </section>
        <section id="contactos">
          <h2>Responsável e contactos</h2>
          <p>{SITE.legalName}, NIF {SITE.nif}, {SITE.fullAddress}.</p>
          <p>Para questões de privacidade, contacte <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Consulte também a <Link href="/politica-privacidade">Política de Privacidade</Link>.</p>
        </section>
      </LegalLayout>
    </>
  )
}
