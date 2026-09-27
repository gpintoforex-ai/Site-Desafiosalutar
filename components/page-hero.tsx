import Image from 'next/image'
import type { ReactNode } from 'react'

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  alt,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  image?: string
  alt?: string
  children?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden bg-primary">
      {image ? (
        <>
          <Image src={image} alt={alt ?? ''} fill priority sizes="100vw" className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/40" />
        </>
      ) : (
        <div className="leaf-pattern absolute inset-0 opacity-40" />
      )}
      <div className="relative mx-auto max-w-[1200px] px-4 py-20 sm:px-6 md:py-28">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent animate-fade-in">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl animate-fade-in">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85 animate-fade-in">{subtitle}</p>
        {children}
      </div>
    </section>
  )
}
