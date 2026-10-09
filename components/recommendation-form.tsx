'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { CheckCircle2, Leaf, Paperclip, Send } from 'lucide-react'
import { recommendationFields, MAX_FILE_BYTES } from '@/lib/recommendation'
import { readApiResponse } from '@/lib/api-response'

const input = 'mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-leaf'
export function RecommendationForm() {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const data = new FormData(event.currentTarget)
    if (files.length > 2 || files.some(file => file.size > MAX_FILE_BYTES)) { setError('Escolha no máximo 2 ficheiros, até 5 MB cada.'); return }
    setBusy(true)
    try {
      const response = await fetch('/api/recomendacao', { method: 'POST', body: data })
      const result = await readApiResponse<{ error?: string }>(response)
      if (!response.ok) throw new Error(result.error || 'Não foi possível enviar o pedido.')
      setSent(true); setFiles([])
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível enviar o pedido.') }
    finally { setBusy(false) }
  }
  if (sent) return <div role="status" className="rounded-2xl bg-card p-10 text-center shadow-soft"><CheckCircle2 className="mx-auto h-14 w-14 text-leaf" /><h2 className="mt-4 text-3xl font-semibold text-primary">Pedido recebido</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">A nossa equipa irá analisar o seu pedido e entrar em contacto por email. Não volte a enviar os mesmos documentos.</p><button className="mt-6 font-semibold text-primary underline" onClick={() => setSent(false)}>Enviar outro pedido</button></div>
  return <form onSubmit={submit} className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-10">
    <div><h2 className="flex items-center gap-2 text-2xl font-semibold text-primary"><Leaf className="h-6 w-6 text-leaf" /> Conte-nos o que procura</h2><p className="mt-2 text-sm text-muted-foreground">Para maiores de 18 anos. Os campos assinalados com * são obrigatórios. Partilhe apenas informações relevantes para o seu pedido.</p></div>
    <fieldset disabled={busy} className="space-y-8">
      <fieldset><legend className="mb-4 text-lg font-semibold text-primary">1. Os seus dados</legend><div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Nome *<input name="name" autoComplete="name" required minLength={2} maxLength={120} className={input} /></label>
        <label className="text-sm font-medium">Email *<input name="email" type="email" autoComplete="email" required maxLength={160} className={input} /></label>
        <label className="text-sm font-medium">Telefone (opcional)<input name="phone" type="tel" autoComplete="tel" maxLength={20} pattern="[+0-9 ()-]{9,20}" className={input} /></label>
        <label className="text-sm font-medium">Idade *<input name="age" type="number" min={18} max={120} required className={input} /></label>
      </div></fieldset>
      <fieldset className="space-y-5"><legend className="mb-4 text-lg font-semibold text-primary">2. Objetivos e contexto</legend>
        {recommendationFields.map(field => <label key={field.name} className="block text-sm font-medium">{field.label}{'required' in field && field.required ? ' *' : ''}<textarea name={field.name} required={'required' in field && field.required} minLength={field.name === 'goal' ? 10 : undefined} maxLength={1800} rows={field.name === 'goal' ? 4 : 3} placeholder={field.placeholder} className={input} /></label>)}
        <label className="block text-sm font-medium">Gravidez ou amamentação (opcional)<select name="pregnancy" defaultValue="não indicado" className={input}><option value="não indicado">Prefiro não indicar</option><option value="não se aplica">Não se aplica</option><option value="não">Não</option><option value="grávida">Grávida</option><option value="a amamentar">A amamentar</option></select></label>
      </fieldset>
      <fieldset><legend className="mb-3 flex items-center gap-2 text-lg font-semibold text-primary"><Paperclip className="h-5 w-5" /> 3. Anexos (opcional)</legend>
        <p id="attachment-help" className="mb-4 text-sm text-muted-foreground">Pode anexar análises clínicas, documentos relevantes ou fotografias de produtos: até 2 ficheiros PDF, JPG ou PNG, com um máximo de 5 MB cada. Oculte números de identificação, morada e outros dados desnecessários. Anexe apenas documentos seus.</p>
        <label className="block rounded-xl border-2 border-dashed border-leaf/40 bg-secondary/40 p-5 text-sm font-medium">Selecionar ficheiros<input name="files" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple aria-describedby="attachment-help" className="mt-3 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" onChange={event => { setFiles(Array.from(event.target.files || [])); setError('') }} /></label>
        {files.length > 0 && <ul className="mt-3 space-y-1 text-sm">{files.map((file, index) => <li key={index} className="break-words">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</li>)}</ul>}
      </fieldset>
      <div className="space-y-4 border-t border-border pt-6">
        <label className="flex items-start gap-3 text-sm"><input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0" /><span>Li a <Link href="/politica-privacidade" className="text-primary underline">Política de Privacidade</Link> e autorizo o tratamento dos meus dados de contacto para responder a este pedido. *</span></label>
        <label className="flex items-start gap-3 text-sm"><input name="healthConsent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0" /><span>Consinto expressamente no tratamento das informações de saúde e dos documentos que decidi partilhar, pela equipa da Desafio Salutar, exclusivamente para analisar e responder a este pedido. Posso retirar o consentimento contactando a loja. *</span></label>
        <p className="rounded-lg bg-cream p-4 text-sm text-muted-foreground">Este pedido destina-se a aconselhamento em medicina integrativa, com foco em produtos de ervanária e suplementação. Não substitui uma consulta médica, diagnóstico ou prescrição. Não altere medicação com base neste formulário.</p>
      </div>
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {error && <p role="alert" className="rounded-lg border border-destructive p-4 text-sm text-destructive">{error}</p>}
      <button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-soft transition hover:bg-leaf disabled:opacity-50 sm:w-auto"><Send className="h-5 w-5" />{busy ? 'A enviar pedido…' : 'Enviar pedido de recomendação'}</button>
    </fieldset>
  </form>
}
