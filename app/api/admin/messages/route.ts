import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ADMIN_COOKIE, sameOrigin, validAdminSession } from '@/lib/admin-security'
import { createPrismaClient } from '@/lib/db'
import { sendConfiguredEmail } from '@/lib/contact-email'

export const dynamic = 'force-dynamic'
const respond = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
const authenticated = async () => validAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)
type Reply = { id: string; submissionId: string; message: string; status: string; createdAt: Date }

export async function GET(request: Request) {
  if (!await authenticated()) return respond({ error: 'Entre novamente na administração.' }, 401)
  const prisma = createPrismaClient()
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (id) {
      const item = await prisma.contactSubmission.findUnique({ where: { id } })
      if (!item) return respond({ error: 'Mensagem não encontrada.' }, 404)
      const replies = await prisma.$queryRaw<Reply[]>`SELECT * FROM "ContactReply" WHERE "submissionId" = ${id} ORDER BY "createdAt" ASC`
      const attachments = item.formType === 'recomendacao'
        ? await prisma.$queryRaw<{ id: string; name: string; size: number }[]>`SELECT "id", "name", "size" FROM "ContactAttachment" WHERE "submissionId" = ${id} ORDER BY "createdAt" ASC`
        : []
      return respond({ item, replies, attachments })
    }
    const page = Math.max(1, Math.min(100000, Number(url.searchParams.get('page')) || 1))
    const search = (url.searchParams.get('search') || '').slice(0, 200)
    const status = url.searchParams.get('status')
    const where = {
      ...(status && ['novo', 'lido', 'respondido'].includes(status) ? { status } : {}),
      ...(search ? { OR: ['name', 'email', 'subject', 'message'].map(field => ({ [field]: { contains: search, mode: 'insensitive' as const } })) } : {}),
    }
    const [items, total, grouped] = await Promise.all([
      prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (Math.floor(page) - 1) * 20, take: 20, select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true } }),
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.groupBy({ by: ['status'], _count: { _all: true } }),
    ])
    const counts = { novo: 0, lido: 0, respondido: 0 }
    for (const group of grouped) {
      if (group.status === 'novo' || group.status === 'lido' || group.status === 'respondido') counts[group.status] = group._count._all
    }
    return respond({ items, total, unread: counts.novo, counts })
  } catch { return respond({ error: 'Não foi possível carregar as mensagens. Confirme a ligação à base de dados e execute scripts/create-inbox.sql.' }, 503) }
  finally { await prisma.$disconnect() }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return respond({ error: 'Pedido não autorizado.' }, 403)
  if (!await authenticated()) return respond({ error: 'Entre novamente na administração.' }, 401)
  const raw = await request.text()
  if (raw.length > 24000) return respond({ error: 'Pedido demasiado grande.' }, 413)
  let body
  try { body = JSON.parse(raw) } catch { return respond({ error: 'Pedido inválido.' }, 400) }
  const parsed = z.object({ id: z.string().min(1).max(100), action: z.enum(['read', 'unread', 'delete', 'reply']), message: z.string().trim().min(1).max(10000).optional() }).safeParse(body)
  if (!parsed.success || (parsed.data.action === 'reply' && !parsed.data.message)) return respond({ error: 'Indique uma mensagem válida.' }, 400)
  const { id, action, message } = parsed.data
  const prisma = createPrismaClient()
  try {
    const item = await prisma.contactSubmission.findUnique({ where: { id } })
    if (!item) return respond({ error: 'Mensagem não encontrada.' }, 404)
    if (action === 'delete') {
      await prisma.contactSubmission.delete({ where: { id } })
      return respond({ message: 'Mensagem e histórico eliminados.' })
    }
    if (action === 'reply') {
      const replyId = randomUUID()
      // Persist before sending so an accepted email always has a visible history entry.
      await prisma.$executeRaw`INSERT INTO "ContactReply" ("id", "submissionId", "message") VALUES (${replyId}, ${id}, ${message!})`
      try {
        const text = item.formType === 'recomendacao' ? `${message}\n\n— Desafio Salutar` : `${message}\n\n— Desafio Salutar\n\nMensagem original de ${item.name}:\n${item.message}`
        await sendConfiguredEmail(`Re: ${item.subject.replace(/[\r\n]/g, ' ').slice(0, 160)}`, text, undefined, item.email)
      } catch {
        await prisma.$executeRaw`UPDATE "ContactReply" SET "status" = 'falhou' WHERE "id" = ${replyId}`
        return respond({ error: 'O envio não foi confirmado. Verifique o Gmail antes de repetir e confirme as configurações SMTP.' }, 502)
      }
      try {
        await prisma.$transaction([
          prisma.$executeRaw`UPDATE "ContactReply" SET "status" = 'enviado' WHERE "id" = ${replyId}`,
          prisma.contactSubmission.update({ where: { id }, data: { status: 'respondido' } }),
        ])
      } catch { return respond({ message: 'O Gmail aceitou a resposta, mas o estado não foi atualizado. Não repita o envio; confirme na pasta Enviados do Gmail.' }) }
      return respond({ message: 'O Gmail aceitou a resposta para envio ao cliente.' })
    }
    await prisma.contactSubmission.update({ where: { id }, data: { status: action === 'unread' ? 'novo' : item.status === 'novo' ? 'lido' : item.status } })
    return respond({ message: 'Estado atualizado.' })
  } catch { return respond({ error: 'Não foi possível concluir o pedido. Confirme a base de dados e a tabela ContactReply.' }, 503) }
  finally { await prisma.$disconnect() }
}
