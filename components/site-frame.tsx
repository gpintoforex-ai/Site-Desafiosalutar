'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CookieBanner } from '@/components/cookie-banner'
import { ChatWidget } from '@/components/chat-widget'
import { InstallApp } from '@/components/install-app'

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isRecommendation = pathname === '/pedido-recomendacao'
  const isolate = (isAdmin || isRecommendation) && typeof document !== 'undefined' && !!document.querySelector('script[src^="https://apps.abacus.ai/"]')
  useEffect(() => {
    // A third-party script loaded on another SPA page remains able to read its DOM.
    // Do not mount the sensitive surface until a fresh document removes that script.
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
        {!isRecommendation && <><Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" /><ChatWidget /></>}
      </>}
    </>
  )
}
