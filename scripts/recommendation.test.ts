import { test } from 'node:test'
import assert from 'node:assert/strict'
import { MAX_FILE_BYTES, recommendationSchema, validateAttachment } from '../lib/recommendation'

const valid = { name: 'Nome de teste', email: 'teste@example.com', age: 30, pregnancy: 'não indicado', goal: 'Quero esclarecer uma dúvida sobre produtos.', consent: true, healthConsent: true }
test('recommendation requires adult age, explicit consent and valid contact details', () => {
  assert.equal(recommendationSchema.safeParse(valid).success, true)
  for (const change of [{ age: 17 }, { age: '' }, { healthConsent: false }, { consent: false }, { email: 'invalid' }, { goal: 'curto' }]) {
    assert.equal(recommendationSchema.safeParse({ ...valid, ...change }).success, false)
  }
})
test('attachment validates signature, MIME, extension and sanitizes filename', async () => {
  const pdf = new File(['%PDF-1.7\nexample'], 'analise<>.pdf', { type: 'application/pdf' })
  const result = await validateAttachment(pdf)
  assert.equal(result.mime, 'application/pdf'); assert.equal(result.name, 'analise__.pdf')
  await assert.rejects(validateAttachment(new File(['<html>'], 'analise.pdf', { type: 'application/pdf' })))
  await assert.rejects(validateAttachment(new File(['%PDF-1.7'], 'analise.svg')))
  await assert.rejects(validateAttachment(new File(['%PDF-1.7'], 'analise.pdf', { type: 'text/html' })))
  await assert.rejects(validateAttachment(new File([], 'vazio.pdf')))
  await assert.rejects(validateAttachment(new File([new Uint8Array(MAX_FILE_BYTES + 1)], 'grande.pdf')))
  assert.equal((await validateAttachment(new File([new Uint8Array([255, 216, 255, 0])], 'produto.jpg', { type: 'image/jpeg' }))).mime, 'image/jpeg')
  assert.equal((await validateAttachment(new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0])], 'produto.png', { type: 'image/png' }))).mime, 'image/png')
})
