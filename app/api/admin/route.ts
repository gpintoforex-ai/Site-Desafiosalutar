import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ADMIN_COOKIE, SESSION_SECONDS, adminConfigured, createAdminSession, encryptSmtpPassword, sameOrigin, validAdminPassword, validAdminSession } from '@/lib/admin-security'
import { createPrismaClient } from '@/lib/db'
import { sendConfiguredEmail } from '@/lib/contact-email'

export const dynamic = 'force-dynamic'
const attempts = new Map<string, { count: number; until: number }>()
const configSchema = z.object({
  username: z.string().trim().email().max(160).refine(value => /^[^\s<>\r\n]+@gmail\.com$/i.test(value)),
  recipient: z.string().trim().email().max(160).refine(value => !/[<>\r\n]/.test(value)),
  password: z.string().max(100).optional().default(''),
  enabled: z.boolean(),
})
const respond = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

export async function GET() {
  const authenticated = validAdminSession((await cookies()).get(ADMIN_COOKIE)?.value)
  if (!authenticated) return respond({ authenticated: false, configured: adminConfigured() }, 401)
  let prisma: ReturnType<typeof createPrismaClient> | undefined
  try {
    prisma = createPrismaClient()
    const settings = await prisma.smtpSettings.findUnique({ where: { id: 'default' }, select: { username: true, recipient: true, enabled: true, updatedAt: true } })
    return respond({ authenticated: true, settings, hasPassword: Boolean(settings) })
  } catch {
    return respond({ authenticated: true, error: 'Não foi possível ler as configurações. Confirme a criação da tabela SmtpSettings.' }, 503)
  } finally { if (prisma) await prisma.$disconnect() }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return respond({ error: 'Pedido não autorizado.' }, 403)
  const raw = await request.text()
  if (raw.length > 8192) return respond({ error: 'Pedido demasiado grande.' }, 413)
  let body: Record<string, unknown>
  try { body = JSON.parse(raw); if (!body || typeof body !== 'object') throw new Error() }
  catch { return respond({ error: 'Pedido inválido.' }, 400) }
  const cookieStore = await cookies()

  if (body.action === 'login') {
    if (!adminConfigured()) return respond({ error: 'Configure primeiro os segredos de acesso admin na Cloudflare.' }, 503)
    const ip = request.headers.get('cf-connecting-ip') || 'local'
    const now = Date.now()
    // Local burst protection; Cloudflare rate limiting should also protect /api/admin in production.
    const attempt = attempts.get(ip)
    if (attempt && attempt.until > now && attempt.count >= 5) return respond({ error: 'Demasiadas tentativas. Aguarde 15 minutos.' }, 429)
    if (typeof body.password !== 'string' || body.password.length > 200 || !validAdminPassword(body.password)) {
      if (attempts.size >= 1000) attempts.clear()
      attempts.set(ip, { count: attempt && attempt.until > now ? attempt.count + 1 : 1, until: attempt && attempt.until > now ? attempt.until : now + 900000 })
      return respond({ error: 'Password incorreta.' }, 401)
    }
    attempts.delete(ip)
    cookieStore.set(ADMIN_COOKIE, createAdminSession(), { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'strict', path: '/', maxAge: SESSION_SECONDS })
    return respond({ ok: true })
  }

  if (!validAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) return respond({ error: 'Sessão expirada. Entre novamente.' }, 401)
  if (body.action === 'logout') {
    cookieStore.delete(ADMIN_COOKIE)
    return respond({ ok: true })
  }
  if (body.action === 'test') {
    try {
      await sendConfiguredEmail('Teste de email — Desafio Salutar', 'O envio de notificações através do Gmail está configurado.\n\nEsta é uma mensagem de teste enviada a partir da página admin.')
      return respond({ ok: true, message: 'O Gmail aceitou o email de teste. Verifique a caixa de entrada e o spam do destinatário.' })
    } catch (error) {
      return respond({ error: error instanceof Error ? error.message : 'Não foi possível enviar o email de teste.' }, 502)
    }
  }
  if (body.action !== 'save') return respond({ error: 'Ação inválida.' }, 400)
  const parsed = configSchema.safeParse(body)
  if (!parsed.success) return respond({ error: 'Indique uma conta @gmail.com e um destinatário válido.' }, 400)
  const password = parsed.data.password.replace(/\s/g, '')
  if (password && !/^[a-zA-Z0-9]{16}$/.test(password)) return respond({ error: 'A password de aplicação deve ter 16 caracteres, sem espaços.' }, 400)
  let prisma: ReturnType<typeof createPrismaClient> | undefined
  try {
    prisma = createPrismaClient()
    const existing = await prisma.smtpSettings.findUnique({ where: { id: 'default' } })
    if (!password && (!existing || existing.username !== parsed.data.username)) return respond({ error: 'Introduza a password de aplicação para esta conta Gmail.' }, 400)
    const passwordCiphertext = password ? encryptSmtpPassword(password) : existing!.passwordCiphertext
    const data = { username: parsed.data.username, recipient: parsed.data.recipient, enabled: parsed.data.enabled, passwordCiphertext }
    await prisma.smtpSettings.upsert({ where: { id: 'default' }, create: { id: 'default', ...data }, update: data })
    return respond({ ok: true, message: 'Configurações guardadas.' })
  } catch {
    return respond({ error: 'Não foi possível guardar. Confirme a tabela SmtpSettings e o segredo SMTP_ENCRYPTION_KEY.' }, 503)
  } finally { if (prisma) await prisma.$disconnect() }
}
