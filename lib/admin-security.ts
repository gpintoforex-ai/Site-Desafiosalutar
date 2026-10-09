import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { runtimeEnv } from './runtime-env'

export const ADMIN_COOKIE = 'ds-admin'
export const SESSION_SECONDS = 8 * 60 * 60

function sessionKey() {
  const key = runtimeEnv('ADMIN_SESSION_SECRET')
  if (key.length < 32) throw new Error('Configure ADMIN_SESSION_SECRET com pelo menos 32 caracteres.')
  return key
}

export function adminConfigured() {
  return /^[a-f0-9]{64}$/i.test(runtimeEnv('ADMIN_PASSWORD_HASH')) && runtimeEnv('ADMIN_SESSION_SECRET').length >= 32
}

export function validAdminPassword(password: string) {
  if (!adminConfigured()) return false
  const actual = createHash('sha256').update(password).digest()
  return timingSafeEqual(actual, Buffer.from(runtimeEnv('ADMIN_PASSWORD_HASH'), 'hex'))
}

export function createAdminSession() {
  const payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${randomBytes(24).toString('hex')}`
  return `${payload}.${createHmac('sha256', sessionKey()).update(payload).digest('hex')}`
}

export function validAdminSession(token?: string) {
  if (!token || !adminConfigured()) return false
  const parts = token.split('.')
  if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{48}$/.test(parts[1]) || !/^[a-f0-9]{64}$/.test(parts[2])) return false
  const expiry = Number(parts[0])
  const now = Math.floor(Date.now() / 1000)
  if (expiry <= now || expiry > now + SESSION_SECONDS) return false
  const signature = createHmac('sha256', sessionKey()).update(`${parts[0]}.${parts[1]}`).digest()
  return timingSafeEqual(signature, Buffer.from(parts[2], 'hex'))
}

function encryptionKey() {
  const key = runtimeEnv('SMTP_ENCRYPTION_KEY')
  if (!/^[a-f0-9]{64}$/i.test(key)) throw new Error('Configure SMTP_ENCRYPTION_KEY com 64 caracteres hexadecimais.')
  return Buffer.from(key, 'hex')
}

export function encryptSmtpPassword(password: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()])
  return [iv, cipher.getAuthTag(), encrypted].map(value => value.toString('base64')).join('.')
}

export function decryptSmtpPassword(value: string) {
  const parts = value.split('.')
  if (parts.length !== 3) throw new Error('Credencial SMTP inválida.')
  const [iv, tag, encrypted] = parts.map(part => Buffer.from(part, 'base64'))
  const cipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv)
  cipher.setAuthTag(tag)
  return Buffer.concat([cipher.update(encrypted), cipher.final()]).toString('utf8')
}

export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin
}
