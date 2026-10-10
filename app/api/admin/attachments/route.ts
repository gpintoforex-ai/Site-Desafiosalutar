import { cookies } from 'next/headers'
import { ADMIN_COOKIE, validAdminSession } from '@/lib/admin-security'
import { createPrismaClient } from '@/lib/db'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  if (!validAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)) return new Response('Não autorizado.', { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const id = new URL(request.url).searchParams.get('id')
  if (!id || id.length > 100) return new Response('Pedido inválido.', { status: 400 })
  let prisma: ReturnType<typeof createPrismaClient> | undefined
  try {
    prisma = createPrismaClient()
    // Transfer binary as text: Prisma's raw BYTEA serialization is expensive in Workers.
    const rows = await prisma.$queryRaw<{ name: string; mime: string; content: string }[]>`SELECT "name", "mime", encode("data", 'base64') AS "content" FROM "ContactAttachment" WHERE "id" = ${id}`
    const file = rows[0]
    if (!file) return new Response('Ficheiro não encontrado.', { status: 404 })
    const bytes = Buffer.from(file.content, 'base64')
    return new Response(bytes, { headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="anexo"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox",
    } })
  } catch { return new Response('Não foi possível obter o anexo.', { status: 503 }) }
  finally { if (prisma) await prisma.$disconnect() }
}
