import { createPrismaClient } from './db'
import { decryptSmtpPassword } from './admin-security'
import { sendSmtpMail } from './smtp'

export async function sendConfiguredEmail(subject: string, text: string, replyTo?: string, recipient?: string) {
  const prisma = createPrismaClient()
  let settings
  try { settings = await prisma.smtpSettings.findUnique({ where: { id: 'default' } }) }
  finally { await prisma.$disconnect() }
  if (!settings?.enabled) throw new Error('Configure e ative o envio Gmail na página admin.')
  await sendSmtpMail({ username: settings.username, password: decryptSmtpPassword(settings.passwordCiphertext), recipient: recipient ?? settings.recipient, subject, text, replyTo })
}
