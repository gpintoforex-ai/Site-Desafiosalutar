import { randomBytes, createHash } from 'node:crypto'
import { existsSync, writeFileSync } from 'node:fs'

const file = '.env.admin'
if (existsSync(file)) throw new Error('O ficheiro .env.admin já existe. Não foi substituído.')
const password = randomBytes(24).toString('base64url')
writeFileSync(file, [
  '# Ficheiro privado: não enviar para o GitHub nem partilhar no chat.',
  '# Use esta password para entrar em /admin; não a copie para variáveis públicas.',
  `ADMIN_LOGIN_PASSWORD=${password}`,
  '# Adicione os três segredos seguintes na Cloudflare (Produção).',
  `ADMIN_PASSWORD_HASH=${createHash('sha256').update(password).digest('hex')}`,
  `ADMIN_SESSION_SECRET=${randomBytes(32).toString('hex')}`,
  `SMTP_ENCRYPTION_KEY=${randomBytes(32).toString('hex')}`,
  '',
].join('\n'), { mode: 0o600, flag: 'wx' })
console.log('Segredos criados em .env.admin. Abra esse ficheiro localmente para os configurar.')
