import { Reveal } from '@/components/reveal'

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string
  title: string
  text?: string
  center?: boolean
}) {
  return (
    <Reveal className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-leaf">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{title}</h2>
      {text ? <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{text}</p> : null}
    </Reveal>
  )
}
