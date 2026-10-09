import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPrismaClient } from '@/lib/db'
import { sendConfiguredEmail } from '@/lib/contact-email'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^[+\d\s()-]{9,20}$/.test(v), { message: 'Telefone inválido' }),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  website: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as unknown
    const parsed = schema.safeParse(body ?? {})
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Verifique os campos do formulário e o consentimento RGPD.' },
        { status: 400 },
      )
    }
    const d = parsed.data
    // Honeypot: responde com sucesso sem guardar
    if (d.website && d.website.trim().length > 0) {
      return NextResponse.json({ ok: true })
    }
    const prisma = createPrismaClient()
    try {
      await prisma.contactSubmission.create({
        data: {
          name: d.name,
          email: d.email,
          phone: d.phone ?? null,
          subject: d.subject,
          message: d.message,
          consent: true,
          consentAt: new Date(),
          formType: 'contacto',
        },
      })
    } finally {
      await prisma.$disconnect()
    }

    // Keep the saved message even when SMTP delivery fails.
    try {
      await sendConfiguredEmail(
        `Nova mensagem de contacto - ${d.subject}`,
        [
          'Nova mensagem recebida no site da Desafio Salutar',
          `Nome: ${d.name}`,
          `Email: ${d.email}`,
          `Telefone: ${d.phone ?? 'Nao indicado'}`,
          `Assunto: ${d.subject}`,
          '', d.message, '',
          `Recebida em ${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}`,
        ].join('\n'),
        d.email,
      )
    } catch (mailErr) {
      console.error('Falha ao enviar email de notificacao', mailErr instanceof Error ? mailErr.message : 'Erro SMTP')
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Erro ao guardar contacto', err)
    return NextResponse.json({ error: 'Não foi possível enviar a mensagem. Tente novamente mais tarde.' }, { status: 500 })
  }
}
