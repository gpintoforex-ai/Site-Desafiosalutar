import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

const ROUTES = ['', '/quem-somos', '/produtos', '/marcas', '/contactos', '/pedido-recomendacao', '/politica-privacidade', '/politica-cookies', '/informacao-legal']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const base = host ? `https://${host}` : process.env.NEXTAUTH_URL ?? ''
  return ROUTES.map((r) => ({
    url: `${base}${r}`,
    changeFrequency: 'monthly' as const,
    priority: r === '' ? 1 : 0.7,
  }))
}
