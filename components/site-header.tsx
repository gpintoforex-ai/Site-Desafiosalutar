'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Menu, MessageCircle, Scale, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { NAV_LEGAL, NAV_MAIN } from '@/lib/site'

export function SiteHeader() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const [legalOpen, setLegalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const legalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled((window?.scrollY ?? 0) > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setLegalOpen(false)
  }, [pathname])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (legalRef?.current && !legalRef.current.contains(e.target as Node)) setLegalOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLegalOpen(false)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith?.(href) ?? false)
  const legalActive = NAV_LEGAL.some((l) => isActive(l.href))

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/90 shadow-soft backdrop-blur-md' : 'bg-background/70 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">
          {NAV_MAIN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? 'bg-secondary text-primary' : 'text-foreground/75 hover:bg-secondary hover:text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="relative" ref={legalRef}>
            <button
              type="button"
              onClick={() => setLegalOpen((v) => !v)}
              aria-expanded={legalOpen}
              aria-haspopup="true"
              aria-controls="menu-legal"
              className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                legalActive ? 'bg-secondary text-primary' : 'text-foreground/75 hover:bg-secondary hover:text-primary'
              }`}
            >
              Legal <ChevronDown className={`h-4 w-4 transition-transform ${legalOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            <AnimatePresence>
              {legalOpen && (
                <motion.div
                  id="menu-legal"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-60 rounded-lg bg-card p-2 shadow-lift"
                >
                  {NAV_LEGAL.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      <Scale className="h-4 w-4 text-leaf" aria-hidden="true" />
                      {item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contactos"
            className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:bg-leaf hover:shadow-lift sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Fale Connosco
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-primary hover:bg-secondary lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-movel"
            aria-label="Navegação móvel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-background shadow-soft lg:hidden"
          >
            <ul className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 pb-6 pt-2">
              {[...NAV_MAIN, ...NAV_LEGAL].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`block rounded-md px-4 py-3 text-base font-medium ${
                      isActive(item.href) ? 'bg-secondary text-primary' : 'text-foreground/80 hover:bg-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/contactos"
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> Fale Connosco
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
