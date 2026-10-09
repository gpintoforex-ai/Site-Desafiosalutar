'use client'

import { useCallback, useEffect, useState } from 'react'
import { readApiResponse } from '@/lib/api-response'
type Item = { id: string; name: string; email: string; subject: string; status: string; createdAt: string; phone?: string; message?: string }
type Reply = { id: string; message: string; status: string; createdAt: string }
type Attachment = { id: string; name: string; size: number }
type Counts = { novo: number; lido: number; respondido: number }
type Result = { items?: Item[]; total?: number; unread?: number; counts?: Counts; item?: Item; replies?: Reply[]; attachments?: Attachment[]; error?: string; message?: string }
const button = 'rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary disabled:opacity-50'
const date = (value: string) => new Date(value).toLocaleString('pt-PT')

export function AdminInbox() {
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)
  const [counts, setCounts] = useState<Counts>({ novo: 0, lido: 0, respondido: 0 })
  const unread = counts.novo
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('novo')
  const [selected, setSelected] = useState<Item | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  function changeGroup(value: string) {
    if (value === status) return
    if (draft && !window.confirm('Descartar a resposta ainda não enviada?')) return
    setStatus(value); setPage(1); setSelected(null); setReplies([]); setAttachments([]); setDraft('')
    setConfirmDelete(false); setNotice(''); setError(''); setLoading(true)
  }

  async function api(url: string, payload?: object): Promise<Result> {
    const response = await fetch(url, payload ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) } : { cache: 'no-store' })
    const data = await readApiResponse<Result>(response)
    if (!response.ok) throw new Error(data.error || 'Não foi possível concluir o pedido.')
    return data
  }
  const load = useCallback(async () => {
    const data = await api(`/api/admin/messages?${new URLSearchParams({ page: String(page), search: query, status })}`)
    setItems(data.items || []); setTotal(data.total || 0); setCounts(data.counts || { novo: 0, lido: 0, respondido: 0 })
  }, [page, query, status])
  useEffect(() => {
    let active = true
    api(`/api/admin/messages?${new URLSearchParams({ page: String(page), search: query, status })}`).then(data => {
      if (active) { setItems(data.items || []); setTotal(data.total || 0); setCounts(data.counts || { novo: 0, lido: 0, respondido: 0 }); setError('') }
    }).catch(err => { if (active) setError(err.message) }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [page, query, status])

  async function open(item: Item) {
    if (draft && !window.confirm('Descartar a resposta ainda não enviada?')) return
    setBusy(true); setError(''); setNotice(''); setConfirmDelete(false)
    try {
      const data = await api(`/api/admin/messages?id=${encodeURIComponent(item.id)}`)
      if (item.status === 'novo') await api('/api/admin/messages', { id: item.id, action: 'read' })
      setSelected(data.item ? { ...data.item, status: item.status === 'novo' ? 'lido' : data.item.status } : null)
      setReplies(data.replies || []); setAttachments(data.attachments || []); setDraft(''); await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Erro ao abrir mensagem.') }
    finally { setBusy(false) }
  }
  async function act(action: 'reply' | 'delete' | 'unread') {
    if (!selected) return
    setBusy(true); setError(''); setNotice('')
    try {
      const data = await api('/api/admin/messages', { id: selected.id, action, ...(action === 'reply' ? { message: draft } : {}) })
      setNotice(data.message || '')
      if (action === 'delete') { setSelected(null); setDraft(''); setConfirmDelete(false) }
      else {
        if (action === 'reply') setDraft('')
        const detail = await api(`/api/admin/messages?id=${encodeURIComponent(selected.id)}`)
        setSelected(detail.item || null); setReplies(detail.replies || [])
      }
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir o pedido.')
      if (action === 'reply') {
        try { const detail = await api(`/api/admin/messages?id=${encodeURIComponent(selected.id)}`); setReplies(detail.replies || []) } catch { /* Keep the original error and draft. */ }
      }
    } finally { setBusy(false) }
  }
  return <div className="mt-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold text-primary">Caixa de entrada <span className="text-sm text-muted-foreground">({unread} novas)</span></h2><button className={button} disabled={busy} onClick={() => { setError(''); void load().catch(err => setError(err.message)) }}>Atualizar</button></div>
    <p className="mt-2 text-sm text-muted-foreground">Mensagens recebidas através do formulário do site. As respostas seguem por email; respostas posteriores dos clientes chegam ao Gmail.</p>
    <nav aria-label="Grupos de mensagens" className="mt-5 flex flex-wrap gap-2 border-b border-border pb-3">
      {[
        { value: 'novo', label: 'Inbox' },
        { value: 'lido', label: 'Lidas' },
        { value: 'respondido', label: 'Respondidas' },
      ].map(group => <button key={group.value} type="button" disabled={busy} aria-pressed={status === group.value} onClick={() => changeGroup(group.value)} className={`${button} ${status === group.value ? 'border-primary bg-primary text-primary-foreground hover:bg-primary' : 'text-primary'}`}>
        {group.label}<span className="ml-2 text-xs">({counts[group.value as keyof Counts]})</span>
      </button>)}
    </nav>
    <form className="my-5 flex flex-wrap gap-2" onSubmit={event => { event.preventDefault(); setPage(1); setQuery(search) }}>
      <input aria-label="Pesquisar mensagens" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2" placeholder="Pesquisar nome, email ou mensagem" value={search} onChange={event => setSearch(event.target.value)} />
      <button className={button}>Pesquisar</button>
    </form>
    {error && <p role="alert" className="mb-4 rounded-lg border border-destructive p-3 text-destructive">{error}</p>}
    {notice && <p role="status" className="mb-4 rounded-lg bg-secondary p-3">{notice}</p>}
    <div className="grid gap-5 lg:grid-cols-[minmax(240px,1fr)_2fr]">
      <div>
        {loading ? <p role="status">A carregar mensagens…</p> : items.length === 0 ? <p className="p-4 text-muted-foreground">Nenhuma mensagem encontrada.</p> : <ul className="divide-y divide-border rounded-lg border border-border">{items.map(item => <li key={item.id}><button disabled={busy} onClick={() => void open(item)} className={`w-full p-4 text-left hover:bg-secondary ${selected?.id === item.id ? 'bg-secondary' : ''}`}><span className={`block ${item.status === 'novo' ? 'font-bold' : 'font-medium'}`}>{item.name}</span><span className="block break-words text-sm">{item.subject}</span><span className="mt-2 block text-xs text-muted-foreground">{date(item.createdAt)} · {item.status === 'novo' ? 'Nova' : item.status === 'respondido' ? 'Respondida' : 'Lida'}</span></button></li>)}</ul>}
        <div className="mt-4 flex items-center justify-between gap-2"><button className={button} disabled={page <= 1 || busy} onClick={() => setPage(page - 1)}>Anterior</button><span className="text-xs">{page} / {Math.max(1, Math.ceil(total / 20))}</span><button className={button} disabled={page * 20 >= total || busy} onClick={() => setPage(page + 1)}>Seguinte</button></div>
      </div>
      <div className="min-w-0 rounded-lg border border-border p-5">
        {!selected ? <p className="text-muted-foreground">Selecione uma mensagem para ler ou responder.</p> : <>
          <h3 className="break-words text-xl font-semibold">{selected.subject}</h3>
          <p className="mt-2 break-words text-sm">{selected.name} · {selected.email}</p>
          {selected.phone && <p className="text-sm">Telefone: {selected.phone}</p>}
          <p className="mt-1 text-xs text-muted-foreground">{date(selected.createdAt)}</p>
          <p className="my-6 whitespace-pre-wrap break-words">{selected.message}</p>
          {attachments.length > 0 && <div className="mb-6 rounded-lg bg-secondary p-4"><h4 className="font-semibold">Anexos do pedido</h4><ul className="mt-3 space-y-2">{attachments.map(file => <li key={file.id}><a className="break-words text-sm text-primary underline" href={`/api/admin/attachments?id=${encodeURIComponent(file.id)}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB · Descarregar</a></li>)}</ul></div>}
          <div className="flex flex-wrap gap-2"><button className={button} disabled={busy} onClick={() => void act('unread')}>Marcar como não lida</button><button className={`${button} text-destructive`} disabled={busy} onClick={() => setConfirmDelete(true)}>Eliminar</button></div>
          {confirmDelete && <div className="mt-3 rounded-lg border border-destructive p-3"><p className="text-sm">Eliminar esta mensagem e o histórico de respostas permanentemente?</p><div className="mt-3 flex gap-2"><button className={`${button} text-destructive`} disabled={busy} onClick={() => void act('delete')}>Sim, eliminar</button><button className={button} disabled={busy} onClick={() => setConfirmDelete(false)}>Cancelar</button></div></div>}
          {replies.length > 0 && <div className="mt-6 space-y-3"><h4 className="font-semibold">Histórico de respostas</h4>{replies.map(reply => <div key={reply.id} className="rounded-lg bg-secondary p-4"><p className="text-xs text-muted-foreground">{date(reply.createdAt)} · {reply.status === 'enviado' ? 'Aceite pelo Gmail' : reply.status === 'falhou' ? 'Envio não confirmado' : 'A enviar / por confirmar'}</p><p className="mt-2 whitespace-pre-wrap break-words">{reply.message}</p></div>)}</div>}
          <form className="mt-6 border-t border-border pt-5" onSubmit={event => { event.preventDefault(); void act('reply') }}><label htmlFor="inbox-reply" className="mb-2 block font-semibold">Responder a {selected.name}</label><textarea id="inbox-reply" required maxLength={10000} rows={6} className="w-full rounded-lg border border-border bg-background p-3" value={draft} onChange={event => setDraft(event.target.value)} disabled={busy} /><p className="my-2 break-words text-xs text-muted-foreground">Destinatário: {selected.email}</p><button disabled={busy || !draft.trim()} className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-50">{busy ? 'A processar…' : 'Enviar resposta'}</button></form>
        </>}
      </div>
    </div>
  </div>
}
