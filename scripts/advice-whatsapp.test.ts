import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import RecommendationPage from '../app/pedido-recomendacao/page'
import { POST } from '../app/api/recomendacao/route'
import { SITE } from '../lib/site'

test('advice page provides a voluntary WhatsApp link without collecting health data or attachments', () => {
  const html = renderToStaticMarkup(RecommendationPage())
  assert.ok(html.includes('Falar no WhatsApp'))
  for (const tag of ['<form', '<input', '<textarea', '<iframe']) assert.ok(!html.includes(tag), tag)
  assert.ok(html.includes('Não envie sintomas'))
  assert.ok(html.includes('nenhuma mensagem é enviada automaticamente'))
  assert.ok(html.includes('rel="noopener noreferrer"'))
  assert.ok(html.includes('href="' + SITE.phoneHref + '"'))
  const url = new URL(SITE.adviceWhatsappUrl)
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/351910419820')
  assert.deepEqual([...url.searchParams.keys()], ['text'])
  assert.match(url.searchParams.get('text')!, /informações gerais ou combinar um contacto/)
})

test('old cached forms cannot submit or forward health data, irrespective of consent or attachment', async () => {
  const data = new FormData()
  data.set('healthConsent', 'on')
  data.set('symptoms', 'CONTEÚDO FICTÍCIO QUE NÃO DEVE SER LIDO OU DEVOLVIDO')
  data.append('files', new File(['%PDF-documento-ficticio'], 'teste.pdf', { type: 'application/pdf' }))
  const request = new Request('https://example.com/api/recomendacao', { method: 'POST', body: data })
  const response: Response = Reflect.apply(POST, undefined, [request])
  assert.equal(response.status, 410)
  assert.equal(request.bodyUsed, false)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  assert.equal(response.headers.get('location'), null)
  const result = await response.json() as { code: string }
  assert.equal(result.code, 'recommendation_collection_suspended')
  assert.ok(!JSON.stringify(result).includes('CONTEÚDO FICTÍCIO'))
})
