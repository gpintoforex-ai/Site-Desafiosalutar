import Link from 'next/link'
import { BookOpen, Clock, ExternalLink, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Scale } from 'lucide-react'
import { Logo } from '@/components/logo'
import { ManageCookiesButton } from '@/components/manage-cookies-button'
import { NAV_LEGAL, NAV_MAIN, SITE } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground" aria-labelledby="rodape-titulo">
      <h2 id="rodape-titulo" className="sr-only">
        Rodapé
      </h2>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Produtos naturais selecionados com rigor e aconselhamento personalizado na nossa loja física.
          </p>
          <p className="rounded-md bg-primary-foreground/10 px-3 py-2 text-xs text-primary-foreground/85">
            Não dispomos de loja online. Visite-nos ou contacte-nos.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook (abre numa nova janela)"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (abre numa nova janela)"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-primary-foreground">Contactos</h3>
          <ul className="space-y-3 text-sm text-primary-foreground/85">
            <li className="flex gap-2.5">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                Falar pelo WhatsApp<span className="sr-only"> (abre numa nova janela)</span>
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <address className="not-italic">{SITE.fullAddress}</address>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <a href={SITE.phoneHref} className="hover:text-accent">
                  <span suppressHydrationWarning>{SITE.phone}</span>
                </a>
                <span className="block text-xs text-primary-foreground/70">{SITE.phoneCostNote}</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                <a href={SITE.mobilePhoneHref} className="hover:text-accent">
                  <span suppressHydrationWarning>{SITE.mobilePhone}</span>
                </a>
                <span className="block text-xs text-primary-foreground/70">{SITE.mobilePhoneCostNote}</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-accent">
                <span suppressHydrationWarning>{SITE.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-primary-foreground">Horário</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/85">
            {SITE.hours.map((h) => (
              <li key={h.days} className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="block font-medium text-primary-foreground">{h.days}</span>
                  {h.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg text-primary-foreground">Navegação</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-primary-foreground/85 lg:grid-cols-1">
            {NAV_MAIN.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-black/15">
        <div className="mx-auto max-w-[1200px] space-y-5 px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.livroreclamacoes.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-cream px-4 py-2 text-sm font-semibold text-primary shadow-soft transition hover:bg-accent hover:text-accent-foreground"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Livro de Reclamações Electrónico
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">(abre numa nova janela)</span>
            </a>
            <a
              href="https://www.consumidor.gov.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/20"
            >
              <Scale className="h-4 w-4" aria-hidden="true" />
              Resolução Alternativa de Litígios (RAL)
              <span className="sr-only">(abre numa nova janela)</span>
            </a>
            <Link
              href="/informacao-legal#ral-odr"
              className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/20"
            >
              <Scale className="h-4 w-4" aria-hidden="true" />
              Resolução de Litígios em Linha (ODR)
            </Link>
          </div>

          <p className="text-xs leading-relaxed text-primary-foreground/75">
            Em cumprimento do Decreto-Lei n.º 59/2021: o custo da chamada para o número {SITE.phone} corresponde a uma chamada
            para a rede fixa nacional e para o número {SITE.mobilePhone} a uma chamada para a rede móvel nacional, de acordo
            com o tarifário contratado com o seu operador.
          </p>

          <p className="text-xs leading-relaxed text-primary-foreground/75">
            Os produtos naturais não substituem aconselhamento médico.
          </p>

          <div className="flex flex-col gap-3 border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/75 md:flex-row md:items-center md:justify-between">
            <p>
              © {SITE.copyrightYear} {SITE.name} · {SITE.legalName} · NIF {SITE.nif}. Todos os direitos reservados.
            </p>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {NAV_LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <ManageCookiesButton className="hover:text-accent" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
