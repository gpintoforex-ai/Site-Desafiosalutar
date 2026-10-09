'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { Camera, CheckCircle2, Leaf, Paperclip, Send } from 'lucide-react'
import { recommendationFields, MAX_FILE_BYTES } from '@/lib/recommendation'
import { readApiResponse } from '@/lib/api-response'

const input = 'mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-leaf'
export function RecommendationForm() {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  function addFiles(selected: File[]) {
    if (files.length + selected.length > 2) { setError('Pode adicionar no máximo 2 anexos. Remova um antes de adicionar outro.'); return }
    if (selected.some(file => !file.size || file.size > MAX_FILE_BYTES)) { setError('Cada anexo deve ter até 5 MB e não pode estar vazio.'); return }
    if (selected.some(file => !/\.(pdf|jpe?g|png)$/i.test(file.name))) { setError('Use ficheiros PDF, JPG ou PNG. Se a fotografia estiver em HEIC, converta-a para JPG antes de anexar.'); return }
    setFiles(current => [...current, ...selected]); setError('')
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const data = new FormData(event.currentTarget)
    data.delete('files')
    for (const file of files) data.append('files', file)
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
        <div className="rounded-xl border-2 border-dashed border-leaf/40 bg-secondary/40 p-5">
          <label className="block text-sm font-medium">Selecionar ficheiros<input name="files" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple disabled={files.length >= 2} aria-describedby="attachment-help" className="mt-3 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground" onChange={event => { addFiles(Array.from(event.target.files || [])); event.target.value = '' }} /></label>
          <label className={`relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary ${files.length >= 2 ? 'opacity-50' : 'hover:bg-secondary'}`}><Camera className="h-5 w-5" aria-hidden="true" /> Tirar foto<input aria-label="Tirar foto e anexar ao pedido" type="file" accept="image/jpeg,image/png" capture="environment" disabled={files.length >= 2} aria-describedby="camera-help attachment-help" className="absolute inset-0 cursor-pointer opacity-0" onChange={event => { addFiles(Array.from(event.target.files || [])); event.target.value = '' }} /></label>
          <p id="camera-help" className="mt-3 text-xs text-muted-foreground">No telemóvel, esta opção permite usar a câmara. Noutros dispositivos pode abrir a seleção de imagens. As fotografias contam para o limite de 2 anexos.</p>
        </div>
        {files.length > 0 && <ul className="mt-3 space-y-2 text-sm">{files.map((file, index) => <li key={index} className="flex items-center justify-between gap-3 rounded-lg bg-secondary p-3"><span className="min-w-0 break-words">{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</span><button type="button" aria-label={`Remover ${file.name}`} className="shrink-0 text-primary underline" onClick={() => { setFiles(current => current.filter((_, i) => i !== index)); setError('') }}>Remover</button></li>)}</ul>}
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
