import { test, mock } from 'node:test'
import assert from 'node:assert/strict'

// Isolated handler tests: no database, credentials, emails or production records.
const contact = { id: 'contact-fixture', formType: 'contacto', name: 'Fixture', email: 'fixture@example.invalid', subject: 'General enquiry', message: 'General test message', status: 'novo' }
const legacy = { ...contact, id: 'legacy-fixture', formType: 'recomendacao', message: 'PRIVATE_LEGACY_MARKER' }
let operations: string[] = []
let sent: unknown[][] = []
type Query = { where?: { id?: string; formType?: string }; data?: unknown }
const scoped = (query: Query) => {
  assert.equal(query.where?.formType, 'contacto', 'every message query must exclude legacy records')
  return [contact, legacy].filter(item => item.formType === query.where!.formType && (!query.where!.id || item.id === query.where!.id))
}
const prisma = {
  contactSubmission: {
    create: async () => { operations.push('create'); return contact },
    findFirst: async (q: Query) => scoped(q)[0] || null,
    findMany: async (q: Query) => scoped(q),
    count: async (q: Query) => scoped(q).length,
    groupBy: async (q: Query) => [{ status: 'novo', _count: { _all: scoped(q).length } }],
    delete: async (q: Query) => { operations.push('delete'); return scoped(q)[0] },
    update: async (q: Query) => { operations.push('update'); return scoped(q)[0] },
  },
  $queryRaw: async () => { operations.push('read-replies'); return [] },
  $executeRaw: async () => { operations.push('write-reply'); return 1 },
  $transaction: async (queries: Promise<unknown>[]) => Promise.all(queries),
  $disconnect: async () => {},
}

mock.module('next/headers', { namedExports: { cookies: async () => ({ get: () => ({ value: 'test-session' }) }) } })
mock.module('../lib/admin-security.ts', { namedExports: { ADMIN_COOKIE: 'test-cookie', sameOrigin: () => true, validAdminSession: () => true } })
mock.module('../lib/db.ts', { namedExports: { createPrismaClient: () => prisma } })
mock.module('../lib/contact-email.ts', { namedExports: { sendConfiguredEmail: async (...args: unknown[]) => { sent.push(args) } } })
const { GET, POST } = await import('../app/api/admin/messages/route')
const { GET: attachments } = await import('../app/api/admin/attachments/route')
const { POST: submitContact } = await import('../app/api/contacto/route')
const request = (body: unknown) => new Request('https://example.invalid/api/admin/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

test('list, search and counts exclude legacy records even with an authenticated session', async () => {
  for (const query of ['', '?search=PRIVATE_LEGACY_MARKER', '?status=lido&page=2']) {
    const result = await GET(new Request('https://example.invalid/api/admin/messages' + query))
    assert.equal(result.status, 200)
    const body = await result.json()
    assert.equal(body.total, 1)
    assert.equal(body.counts.novo, 1)
    assert.ok(!JSON.stringify(body).includes('PRIVATE_LEGACY_MARKER'))
  }
})

test('known legacy IDs cannot be read, replied to, changed or deleted', async () => {
  operations = []; sent = []
  assert.equal((await GET(new Request('https://example.invalid/api/admin/messages?id=legacy-fixture'))).status, 404)
  for (const action of ['read', 'unread', 'delete', 'reply']) {
    const result = await POST(request({ id: 'legacy-fixture', action, message: 'Test response' }))
    assert.equal(result.status, 404)
    assert.ok(!(await result.text()).includes('PRIVATE_LEGACY_MARKER'))
  }
  assert.deepEqual(operations, [])
  assert.deepEqual(sent, [])
})

test('ordinary contacts retain detail, reply and state/delete functionality', async () => {
  operations = []; sent = []
  const detail = await GET(new Request('https://example.invalid/api/admin/messages?id=contact-fixture'))
  assert.equal(detail.status, 200)
  assert.equal((await detail.json()).item.id, 'contact-fixture')
  for (const action of ['read', 'unread', 'reply', 'delete']) {
    assert.equal((await POST(request({ id: 'contact-fixture', action, message: 'Test response' }))).status, 200)
  }
  assert.equal(sent.length, 1)
  assert.ok(!String(sent[0][1]).includes(contact.message), 'reply must not automatically forward original content')
  assert.ok(operations.includes('delete'))
})

test('retired attachment endpoint always refuses access without reading identifiers or files', async () => {
  const result = attachments()
  assert.equal(result.status, 410)
  assert.equal(result.headers.get('cache-control'), 'no-store')
  assert.equal(result.headers.get('content-disposition'), null)
})

test('generic contact endpoint rejects additional legacy fields without storing or sending them', async () => {
  operations = []; sent = []
  const valid = { name: 'Fixture', email: 'fixture@example.invalid', subject: 'General question', message: 'A general test question.', consent: true }
  for (const extra of [{ formType: 'recomendacao' }, { symptoms: 'PRIVATE_LEGACY_MARKER' }, { files: ['fixture.pdf'] }]) {
    assert.equal((await submitContact(request({ ...valid, ...extra }))).status, 400)
  }
  assert.deepEqual(operations, [])
  assert.deepEqual(sent, [])
  assert.equal((await submitContact(request(valid))).status, 200)
  assert.deepEqual(operations, ['create'])
  assert.equal(sent.length, 1)
  assert.ok(!String(sent[0][1]).includes(valid.message))
})
