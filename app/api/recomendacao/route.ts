import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Cached forms must not keep collecting health data. Never read or forward their body.
export function POST() {
  return NextResponse.json({
    error: 'O formulário de aconselhamento foi desativado. Para informações gerais ou combinar um contacto, utilize a ligação WhatsApp na página de aconselhamento. Não envie dados de saúde ou análises clínicas.',
    code: 'recommendation_collection_suspended',
  }, { status: 410, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
}
