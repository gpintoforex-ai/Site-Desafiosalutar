import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { SiteFrame } from '@/components/site-frame'
import { SITE } from '@/lib/site'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const viewport: Viewport = { themeColor: '#65b518' }

export async function generateMetadata(): Promise<Metadata> {
  let base: URL | undefined
  try {
    base = new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000')
  } catch {
    base = undefined
  }
  return {
    metadataBase: base,
    title: {
      default: `${SITE.name} — Produtos naturais e aconselhamento`,
      template: `%s | ${SITE.name}`,
    },
    description:
      'Ervanária com chás e infusões, suplementos naturais, fitoterapia, óleos essenciais, cosméticos naturais e mel. Visite a nossa loja e receba aconselhamento personalizado.',
    keywords: ['ervanária', 'produtos naturais', 'fitoterapia', 'chás', 'suplementos', 'óleos essenciais', 'cosmética natural'],
    icons: {
      apple: { url: '/apple-touch-icon.png?v=6', sizes: '180x180', type: 'image/png' },
      icon: { url: '/favicon.svg?v=6', type: 'image/svg+xml', sizes: 'any' },
      shortcut: '/favicon.svg?v=6',
    },
    appleWebApp: { capable: true, title: 'Desafio Salutar', statusBarStyle: 'default' },
    openGraph: {
      type: 'website',
      locale: 'pt_PT',
      siteName: SITE.name,
      title: SITE.name,
      description: 'A natureza ao serviço da sua saúde. Produtos naturais selecionados com rigor para o seu bem-estar.',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE.name,
      description: 'A natureza ao serviço da sua saúde.',
      images: ['/og-image.png'],
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Saltar para o conteúdo
          </a>
          <SiteFrame>{children}</SiteFrame>
          <Toaster />
          {/* IMPORTANT: Do not remove — handles chunk loading race conditions in the dev server */}
          <ChunkLoadErrorHandler />
        </ThemeProvider>
      </body>
    </html>
  )
}
