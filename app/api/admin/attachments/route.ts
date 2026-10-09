import { cookies } from 'next/headers'
import { ADMIN_COOKIE, validAdminSession } from '@/lib/admin-security'
import { createPrismaClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  if (!validAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)) return new Response('Não autorizado.', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const id = new URL(request.url).searchParams.get('id')
  if (!id || id.length > 100) return new Response('Pedido inválido.', { status: 400 })
  const prisma = createPrismaClient()
  try {
    const rows = await prisma.$queryRaw<{ name: string; mime: string; data: Uint8Array }[]>`SELECT "name", "mime", "data" FROM "ContactAttachment" WHERE "id" = ${id}`
    const file = rows[0]
    if (!file) return new Response('Ficheiro não encontrado.', { status: 404 })
    return new Response(new Uint8Array(file.data), { headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="anexo"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox",
    } })
  } catch { return new Response('Não foi possível obter o anexo.', { status: 503 }) }
  finally { await prisma.$disconnect() }
}
