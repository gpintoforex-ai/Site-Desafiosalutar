import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db'
import { sendConfiguredEmail } from '@/lib/contact-email'
import { sameOrigin } from '@/lib/admin-security'
import { MAX_REQUEST_BYTES, recommendationFields, recommendationSchema, validateAttachment } from '@/lib/recommendation'

export const dynamic = 'force-dynamic'
const respond = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
const attempts = new Map<string, { count: number; until: number }>()

export async function POST(request: Request) {
  if (!sameOrigin(request)) return respond({ error: 'Pedido não autorizado.' }, 403)
  const ip = request.headers.get('cf-connecting-ip') || 'local'
  const now = Date.now()
  const attempt = attempts.get(ip)
  if (attempt && attempt.until > now && attempt.count >= 5) return respond({ error: 'Aguarde alguns minutos antes de enviar outro pedido.' }, 429)
  if (attempts.size >= 1000) attempts.clear()
  attempts.set(ip, { count: attempt && attempt.until > now ? attempt.count + 1 : 1, until: attempt && attempt.until > now ? attempt.until : now + 900000 })
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) return respond({ error: 'Formato de pedido inválido.' }, 400)
  if (Number(request.headers.get('content-length') || 0) > MAX_REQUEST_BYTES) return respond({ error: 'Os anexos excedem o limite permitido.' }, 413)
  let form: FormData
  try {
    // Bound the actual body too, including requests without Content-Length.
    if (!request.body) return respond({ error: 'Pedido vazio.' }, 400)
    const reader = request.body.getReader()
    const chunks: Uint8Array[] = []
    let size = 0
    while (true) {
      const chunk = await reader.read()
      if (chunk.done) break
      size += chunk.value.byteLength
      if (size > MAX_REQUEST_BYTES) { await reader.cancel(); return respond({ error: 'Os anexos excedem o limite permitido.' }, 413) }
      chunks.push(chunk.value)
    }
    form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': request.headers.get('content-type')! } }).formData()
  } catch { return respond({ error: 'Não foi possível ler o formulário.' }, 400) }
  if (String(form.get('website') || '').trim()) return respond({ ok: true })
  const parsed = recommendationSchema.safeParse({ ...Object.fromEntries(form.entries()), consent: form.get('consent') === 'on', healthConsent: form.get('healthConsent') === 'on' })
  if (!parsed.success) return respond({ error: 'Verifique os campos obrigatórios, a idade (18 anos ou mais) e os consentimentos.' }, 400)
  const files = form.getAll('files').filter((entry): entry is File => typeof entry !== 'string' && entry.size > 0)
  if (files.length > 2) return respond({ error: 'Pode anexar no máximo 2 ficheiros.' }, 400)
  let attachments
  try { attachments = await Promise.all(files.map(validateAttachment)) }
  catch (error) { return respond({ error: error instanceof Error ? error.message : 'Anexo inválido.' }, 400) }
  const d = parsed.data
  const message = [
    `Idade: ${d.age} anos`, `Gravidez / amamentação: ${d.pregnancy}`,
    ...recommendationFields.map(field => `${field.label}\n${d[field.name] || 'Não indicado'}`),
    'Consentimento explícito para tratar os dados de saúde e anexos para responder a este pedido: sim.',
  ].join('\n\n')
  let prisma
  try {
    prisma = createPrismaClient()
    await prisma.$transaction(async tx => {
      const item = await tx.contactSubmission.create({ data: { name: d.name, email: d.email, phone: d.phone || null, subject: 'Pedido de recomendação', message, consent: true, consentAt: new Date(), formType: 'recomendacao' } })
      for (const file of attachments) {
        await tx.$executeRaw`INSERT INTO "ContactAttachment" ("id", "submissionId", "name", "mime", "size", "data") VALUES (${randomUUID()}, ${item.id}, ${file.name}, ${file.mime}, ${file.bytes.length}, ${file.bytes})`
      }
    })
  } catch { return respond({ error: 'Não foi possível guardar o pedido. Tente novamente mais tarde.' }, 503) }
  finally { if (prisma) await prisma.$disconnect() }
  try {
    // Health details and files stay in the private inbox, never in notification emails.
    await sendConfiguredEmail('Novo pedido de recomendação — Desafio Salutar', 'Foi recebido um novo pedido de recomendação. Entre na administração do site para consultar o pedido e eventuais anexos.\n\nhttps://desafiosalutar.pt/admin')
  } catch { console.error('Falha na notificação de novo pedido de recomendação') }
  return respond({ ok: true })
}
