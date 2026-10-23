import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CONSENT_EVENT, CONSENT_KEY, readConsent, saveConsent } from '../lib/consent'

test('consent requires current version and explicit boolean values; old/malformed records never enable providers', () => {
  const target = new EventTarget()
  const storage = new Map<string, string>()
  const fake = Object.assign(target, { localStorage: { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string,v: string) => storage.set(k,v), removeItem: (k: string) => storage.delete(k) } })
  Object.defineProperty(globalThis, 'window', { configurable: true, value: fake })
  try {
    assert.equal(readConsent(), null)
    const record = { version: 2, necessary: true, functional: true, analytics: false, marketing: false, updatedAt: new Date().toISOString() }
    storage.set('nv-cookie-consent-v1', JSON.stringify({ ...record, version: undefined }))
    assert.equal(readConsent(), null)
    for (const raw of ['{}', 'null', '[true]', 'broken', JSON.stringify({ ...record, functional: 'false' }), JSON.stringify({ ...record, necessary: false }), JSON.stringify({ ...record, version: 1 }), JSON.stringify({ ...record, updatedAt: 'invalid' })]) {
      storage.set(CONSENT_KEY, raw)
      assert.equal(readConsent(), null, raw)
    }
    let updates = 0
    fake.addEventListener(CONSENT_EVENT, () => updates++)
    saveConsent({ functional: true, analytics: false, marketing: false })
    assert.equal(readConsent()?.functional, true)
    assert.equal(readConsent()?.version, 2)
    assert.equal(storage.has('nv-cookie-consent-v1'), false)
    saveConsent({ functional: false, analytics: false, marketing: false })
    assert.equal(readConsent()?.functional, false)
    assert.equal(updates, 2)
  } finally { Reflect.deleteProperty(globalThis, 'window') }
})
