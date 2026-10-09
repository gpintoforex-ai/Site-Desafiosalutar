'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Script from 'next/script'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CookieBanner } from '@/components/cookie-banner'
import { ChatWidget } from '@/components/chat-widget'

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isRecommendation = pathname === '/pedido-recomendacao'
  return (
    <>
      {!isAdmin && <SiteHeader />}
      <main id="conteudo" className="min-h-screen">{children}</main>
      {!isAdmin && <>
        <SiteFooter />
        <CookieBanner />
        {!isRecommendation && <><Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" /><ChatWidget /></>}
      </>}
    </>
  )
}
