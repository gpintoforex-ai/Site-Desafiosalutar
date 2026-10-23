'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CookieBanner } from '@/components/cookie-banner'
import { ChatWidget } from '@/components/chat-widget'
import { InstallApp } from '@/components/install-app'
import { CONSENT_EVENT, readConsent } from '@/lib/consent'

function subscribeConsent(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => { window.removeEventListener(CONSENT_EVENT, onChange); window.removeEventListener('storage', onChange) }
}
const functionalConsent = () => readConsent()?.functional === true
const noServerConsent = () => false

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isRecommendation = pathname === '/pedido-recomendacao'
  const functional = useSyncExternalStore(subscribeConsent, functionalConsent, noServerConsent)
  const isolate = (isAdmin || isRecommendation || !functional) && typeof document !== 'undefined' && !!document.querySelector('script[src^="https://apps.abacus.ai/"], script[src^="https://api.abacus.ai/"]')
  useEffect(() => {
    // Removing a script element cannot stop already executed SDK code.
    // Reload after withdrawal, or before entering a sensitive surface, to isolate it.
    if (isolate) window.location.replace(window.location.href)
  }, [isolate])
  if (isolate) return <main id="conteudo" role="status">A abrir a área protegida…</main>
  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main id="conteudo" className="min-h-screen">{children}</main>
      {!isAdmin && <>
        <SiteFooter />
        <CookieBanner />
        <InstallApp />
        {!isRecommendation && functional && <><Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" /><ChatWidget /></>}
      </>}
    </>
  )
}
