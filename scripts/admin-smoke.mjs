import assert from 'node:assert/strict'

const base = 'http://localhost:3001'
async function post(body, origin = base, cookie) {
  return fetch(`${base}/api/admin`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', origin, ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body), signal: AbortSignal.timeout(45000),
  })
}
assert.ok(process.env.ADMIN_LOGIN_PASSWORD, 'Run with --env-file=.env.admin')
const status = await fetch(`${base}/api/admin`, { signal: AbortSignal.timeout(45000) })
assert.equal(status.status, 401)
assert.equal((await status.json()).configured, true)
assert.equal((await post({ action: 'save' })).status, 401)
assert.equal((await fetch(`${base}/api/admin/messages`)).status, 401)
for (const action of ['reply', 'delete', 'read']) {
  const response = await fetch(`${base}/api/admin/messages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', origin: base },
    body: JSON.stringify({ action, id: 'not-a-real-message', message: 'test' }),
  })
  assert.equal(response.status, 401)
}
assert.equal((await post({ action: 'login', password: process.env.ADMIN_LOGIN_PASSWORD }, 'https://evil.example')).status, 403)
assert.equal((await post({ action: 'login', password: 'invalid' })).status, 401)
const login = await post({ action: 'login', password: process.env.ADMIN_LOGIN_PASSWORD })
assert.equal(login.status, 200)
const cookie = login.headers.get('set-cookie')
assert.match(cookie, /HttpOnly/i)
assert.match(cookie, /SameSite=strict/i)
assert.equal((await fetch(`${base}/api/admin/messages`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', origin: 'https://evil.example', cookie: cookie.split(';')[0] },
  body: JSON.stringify({ action: 'delete', id: 'not-a-real-message' }),
})).status, 403)
assert.equal((await post({ action: 'logout' }, base, cookie.split(';')[0])).status, 200)
const page = await fetch(`${base}/admin`, { signal: AbortSignal.timeout(45000) })
assert.equal(page.status, 200)
const html = await page.text()
assert.ok(html.includes('Administração'))
assert.ok(!html.includes('https://apps.abacus.ai/chatllm/appllm-lib.js'))
assert.ok(!html.includes(process.env.ADMIN_LOGIN_PASSWORD))
console.log('Admin smoke checks passed: protected API, CSRF, login/logout, cookie flags and isolated admin page. No emails sent or database changes made.')
