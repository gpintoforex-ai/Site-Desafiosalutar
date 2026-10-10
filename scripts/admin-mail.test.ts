import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { Duplex } from 'node:stream'
import type { connect } from 'node:tls'
import { createAdminSession, decryptSmtpPassword, encryptSmtpPassword, sameOrigin, validAdminPassword, validAdminSession } from '../lib/admin-security'
import { sendSmtpMail } from '../lib/smtp'

process.env.ADMIN_PASSWORD_HASH = createHash('sha256').update('a-long-random-test-password').digest('hex')
process.env.ADMIN_SESSION_SECRET = 'test-secret-with-more-than-thirty-two-characters'
process.env.SMTP_ENCRYPTION_KEY = 'ab'.repeat(32)

test('admin authentication rejects wrong passwords, forged sessions and cross-origin requests', () => {
  assert.equal(validAdminPassword('incorrect'), false)
  assert.equal(validAdminPassword('a-long-random-test-password'), true)
  const token = createAdminSession()
  assert.equal(validAdminSession(token), true)
  assert.equal(validAdminSession(token.slice(0, -1) + (token.endsWith('0') ? '1' : '0')), false)
  assert.equal(validAdminSession('1.' + token.split('.').slice(1).join('.')), false)
  assert.equal(validAdminSession(undefined), false)
  assert.equal(sameOrigin(new Request('https://desafiosalutar.pt/api/admin', { headers: { origin: 'https://evil.example' } })), false)
  assert.equal(sameOrigin(new Request('https://desafiosalutar.pt/api/admin', { headers: { origin: 'https://desafiosalutar.pt' } })), true)
})

test('SMTP passwords are encrypted with fresh nonces and reject tampered ciphertext', () => {
  const password = 'abcdefghijklmnop'
  const encrypted = encryptSmtpPassword(password)
  assert.equal(encrypted.includes(password), false)
  assert.equal(decryptSmtpPassword(encrypted), password)
  assert.notEqual(encryptSmtpPassword(password), encrypted)
  const parts = encrypted.split('.')
  const ciphertext = Buffer.from(parts[2], 'base64')
  ciphertext[0] ^= 1
  parts[2] = ciphertext.toString('base64')
  assert.throws(() => decryptSmtpPassword(parts.join('.')))
})

function fakeServer(rejectAuth = false, fragmented = false) {
  const commands: string[] = []
  const responses = ['250-test\r\n250 AUTH LOGIN', '334 username', '334 password', rejectAuth ? '535 rejected' : '235 accepted', '250 sender', '250 recipient', '354 data', '250 queued']
  const socket = new Duplex({
    read() {},
    write(chunk, _encoding, done) {
      commands.push(chunk.toString())
      const response = responses.shift()
      if (response) queueMicrotask(() => push(response + '\r\n'))
      done()
    },
  })
  function push(value: string) {
    if (fragmented) { for (const character of value) socket.push(Buffer.from(character)) }
    else socket.push(value)
  }
  queueMicrotask(() => push('220 fake SMTP\r\n'))
  const factory = (() => socket) as unknown as typeof connect
  return { factory, commands }
}
const mail = { username: 'desafiosalutar@gmail.com', password: 'abcdefghijklmnop', recipient: 'desafiosalutar@hotmail.com', subject: 'Teste de mensagem', text: 'Olá!\n.\nMensagem do cliente.', replyTo: 'cliente@example.com' }

test('SMTP handles multiline responses, authenticates and sends the client reply-to with base64 text', async () => {
  const server = fakeServer()
  await sendSmtpMail(mail, server.factory)
  const message = server.commands.find(command => command.includes('MIME-Version:'))!
  assert.match(message, /Reply-To: cliente@example.com/)
  assert.match(message, /Content-Transfer-Encoding: base64/)
  assert.equal(Buffer.from(message.split('\r\n\r\n')[1].replace(/\r\n\.$/, '').replace(/\r\n/g, ''), 'base64').toString(), mail.text)
})

test('SMTP authentication failures do not send message data or leak credentials', async () => {
  const server = fakeServer(true)
  await assert.rejects(sendSmtpMail(mail, server.factory), /password de aplicação/)
  assert.equal(server.commands.some(command => command.startsWith('DATA')), false)
})

test('SMTP handles byte-by-byte TCP replies including split CRLF and multiline EHLO', async () => {
  const server = fakeServer(false, true)
  await sendSmtpMail(mail, server.factory)
  assert.equal(server.commands.filter(command => command.includes('MIME-Version:')).length, 1)
})

test('SMTP rejects header injection before opening a connection', async () => {
  await assert.rejects(sendSmtpMail({ ...mail, recipient: 'x@example.com\r\nBcc: bad@example.com' }, () => { throw new Error('must not connect') }), /inválido/)
})
