import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { Reveal } from '@/components/reveal'

export function LegalLayout({ toc, children, animate = true }: { toc: { id: string; label: string }[]; children: ReactNode; animate?: boolean }) {
  const Content = animate ? Reveal : 'div'
  return (
    <div className="px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <nav aria-label="Índice" className="rounded-lg bg-cream p-5 shadow-soft">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-leaf">
              <FileText className="h-4 w-4" aria-hidden="true" /> Índice
            </p>
            <ol className="space-y-1.5 text-sm">
              {(toc ?? []).map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="block rounded px-2 py-1 text-foreground/80 transition hover:bg-card hover:text-primary">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <Content>
          <article className="legal-prose rounded-xl bg-card p-6 shadow-soft sm:p-10 [&_section]:scroll-mt-28">{children}</article>
        </Content>
      </div>
    </div>
  )
}
