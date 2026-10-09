import { connect } from 'node:tls'
import { createInterface } from 'node:readline'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

export type SmtpMail = { username: string; password: string; recipient: string; subject: string; text: string; replyTo?: string }

export async function sendSmtpMail(mail: SmtpMail, connectionFactory: typeof connect = connect) {
  for (const address of [mail.username, mail.recipient, ...(mail.replyTo ? [mail.replyTo] : [])]) {
    if (!z.string().email().safeParse(address).success || /[\r\n<>]/.test(address)) throw new Error('Endereço de email inválido.')
  }
  // Only Gmail with implicit TLS is supported; admin input cannot select arbitrary network destinations.
  const socket = connectionFactory({ host: 'smtp.gmail.com', port: 465, servername: 'smtp.gmail.com', rejectUnauthorized: true })
  const lines = createInterface({ input: socket, crlfDelay: Infinity })
  const iterator = lines[Symbol.asyncIterator]()
  let timer: ReturnType<typeof setTimeout> | undefined
  let networkError: Error | undefined
  socket.on('error', error => { networkError = error; lines.close() })

  async function reply(expected: number[]) {
    for (let count = 0; count < 100; count++) {
      const { value, done } = await iterator.next()
      if (done) throw new Error(networkError ? 'Não foi possível ligar ao Gmail por TLS.' : 'O servidor SMTP fechou a ligação.')
      if (value.length > 4096 || !/^\d{3}[ -]/.test(value)) throw new Error('Resposta SMTP inválida.')
      if (value[3] === '-') continue
      const code = Number(value.slice(0, 3))
      if (!expected.includes(code)) {
        if (code === 535) throw new Error('O Gmail recusou a autenticação. Verifique a password de aplicação.')
        throw new Error(`O Gmail recusou o envio (código SMTP ${code}).`)
      }
      return
    }
    throw new Error('Resposta SMTP demasiado longa.')
  }
  async function command(value: string, expected: number[]) {
    socket.write(`${value}\r\n`)
    await reply(expected)
  }
  async function transaction() {
    await reply([220])
    await command('EHLO desafiosalutar.pt', [250])
    await command('AUTH LOGIN', [334])
    await command(Buffer.from(mail.username).toString('base64'), [334])
    await command(Buffer.from(mail.password).toString('base64'), [235])
    await command(`MAIL FROM:<${mail.username}>`, [250])
    await command(`RCPT TO:<${mail.recipient}>`, [250, 251])
    await command('DATA', [354])
    const body = Buffer.from(mail.text, 'utf8').toString('base64').match(/.{1,76}/g)?.join('\r\n') || ''
    const headers = [
      `From: Desafio Salutar <${mail.username}>`, `To: ${mail.recipient}`,
      `Subject: =?UTF-8?B?${Buffer.from(mail.subject.slice(0, 180)).toString('base64')}?=`,
      `Date: ${new Date().toUTCString()}`, `Message-ID: <${randomUUID()}@gmail.com>`,
      ...(mail.replyTo ? [`Reply-To: ${mail.replyTo}`] : []),
      'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64',
    ].join('\r\n')
    await command(`${headers}\r\n\r\n${body}\r\n.`, [250])
    // Once DATA is accepted, a QUIT failure must not turn a successful send into a failure.
    socket.end('QUIT\r\n')
  }
  try {
    await Promise.race([
      transaction(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('O Gmail demorou demasiado a responder.')), 20000) }),
    ])
  } finally {
    clearTimeout(timer)
    lines.close()
    socket.destroy()
  }
}
