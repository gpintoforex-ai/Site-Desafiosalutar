import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createPrismaClient } from '@/lib/db'

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

    // Enviar email de notificação para a loja (não bloqueia a resposta em caso de falha)
    try {
      const appUrl = process.env.NEXTAUTH_URL || ''
      const hostname = appUrl ? new URL(appUrl).hostname : 'localhost'
      const submittedAt = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
      const htmlBody = `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
          <h2 style="color: #2D5016; border-bottom: 2px solid #8FB339; padding-bottom: 10px;">Nova mensagem de contacto</h2>
          <div style="background: #F5F0E8; padding: 20px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 8px 0;"><strong>Nome:</strong> ${d.name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${d.email}">${d.email}</a></p>
            <p style="margin: 8px 0;"><strong>Telefone:</strong> ${d.phone ?? 'Não indicado'}</p>
            <p style="margin: 8px 0;"><strong>Assunto:</strong> ${d.subject}</p>
            <p style="margin: 8px 0;"><strong>Mensagem:</strong></p>
            <div style="background: #ffffff; padding: 15px; border-radius: 4px; border-left: 4px solid #4A7C23; white-space: pre-wrap;">${d.message}</div>
          </div>
          <p style="color: #666; font-size: 12px;">Submetido em ${submittedAt} através do site da Ervanária Desafio Salutar.</p>
        </div>`

      const res = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_MENSAGEM_DE_CONTACTO,
          subject: `Nova mensagem de contacto — ${d.subject}`,
          body: htmlBody,
          is_html: true,
          recipient_email: 'desafiosalutar@hotmail.com',
          reply_to: d.email,
          sender_email: `noreply@${hostname}`,
          sender_alias: 'Ervanária Desafio Salutar',
        }),
      })
      const result = (await res.json().catch(() => null)) as {
        result?: { success?: boolean; notification_disabled?: boolean }
        success?: boolean
        notification_disabled?: boolean
      } | null
      const innerOk = result?.result?.success ?? result?.success
      if (!innerOk && !result?.notification_disabled && !result?.result?.notification_disabled) {
        console.error('Falha ao enviar email de notificação', result)
      }
    } catch (mailErr) {
      console.error('Erro ao enviar email de notificação', mailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Erro ao guardar contacto', err)
    return NextResponse.json({ error: 'Não foi possível enviar a mensagem. Tente novamente mais tarde.' }, { status: 500 })
  }
}
