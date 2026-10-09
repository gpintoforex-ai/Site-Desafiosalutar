import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readApiResponse } from '../lib/api-response'

test('empty, truncated and proxy responses give a useful error, never success', async () => {
  for (const body of ['', '{"ok":', '<html>upstream error</html>', 'null', '[]']) {
    await assert.rejects(readApiResponse(new Response(body, { status: 502 })), /HTTP 502/)
  }
  await assert.rejects(readApiResponse(new Response('', { status: 200 })), /confirme o resultado antes de repetir/)
})
test('JSON API success and error messages are preserved', async () => {
  assert.deepEqual(await readApiResponse(new Response('{"ok":true}')), { ok: true })
  assert.deepEqual(await readApiResponse(new Response('{"error":"Sessão expirada"}', { status: 401 })), { error: 'Sessão expirada' })
})
