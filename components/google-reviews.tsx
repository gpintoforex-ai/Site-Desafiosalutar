import { ArrowUpRight, Star } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SITE } from '@/lib/site'

export function GoogleReviews() {
  const { score, count, checkedAt } = SITE.googleRating
  const rating = score.toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const checkedDate = new Date(`${checkedAt}T12:00:00Z`).toLocaleDateString('pt-PT', { timeZone: 'Europe/Lisbon' })

  return (
    <section className="bg-cream px-4 py-20 sm:px-6 md:py-24" aria-labelledby="avaliacoes-google">
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mx-auto max-w-xl rounded-xl border border-border bg-card px-6 py-10 text-center shadow-soft sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-leaf">Avaliações no Google</p>
          <h2 id="avaliacoes-google" className="mt-3 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            A sua confiança conta
          </h2>
          <p className="mt-6 font-display text-7xl font-semibold tracking-tight text-primary">
            {rating}<span className="ml-2 font-sans text-xl font-normal text-muted-foreground">/ 5</span>
          </p>
          <div className="mt-4 flex justify-center gap-1.5" role="img" aria-label={`${rating} de 5 estrelas`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className="relative block h-8 w-8" aria-hidden="true">
                <Star className="absolute inset-0 h-8 w-8 fill-muted text-muted" />
                <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${Math.max(0, Math.min(1, score - index)) * 100}%` }}>
                  <Star className="h-8 w-8 fill-current text-rating" />
                </span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-base text-muted-foreground">
            Com base em <strong className="font-semibold text-foreground">{count} avaliações</strong> no Google
          </p>
          <a
            href={SITE.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition hover:bg-leaf"
          >
            Ler avaliações no Google
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (abre numa nova janela)</span>
          </a>
          <p className="mt-4 text-xs text-muted-foreground">Classificação consultada em <time dateTime={checkedAt}>{checkedDate}</time>.</p>
        </Reveal>
      </div>
    </section>
  )
}
