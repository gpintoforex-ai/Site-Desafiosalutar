'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { AdminInbox } from '@/components/admin-inbox'

type Settings = { username: string; recipient: string; enabled: boolean }
type ApiResponse = { authenticated?: boolean; configured?: boolean; settings?: Settings; error?: string; message?: string }
const buttonClass = 'rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-leaf disabled:opacity-50'

export function AdminSmtp() {
  const [authenticated, setAuthenticated] = useState(false)
  const [tab, setTab] = useState<'inbox' | 'settings'>('inbox')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [password, setPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)
  const [settings, setSettings] = useState<Settings>({ username: 'desafiosalutar@gmail.com', recipient: 'desafiosalutar@hotmail.com', enabled: true })

  async function load() {
    const response = await fetch('/api/admin', { cache: 'no-store' })
    return await response.json() as ApiResponse
  }
  function applyData(data: ApiResponse) {
    if (data.authenticated) {
      setAuthenticated(true)
      if (data.settings) { setSettings(data.settings); setSaved(true); setHasPassword(true) }
      if (data.error) setError(data.error)
    } else {
      setAuthenticated(false)
      if (data.configured === false) setError('O acesso admin ainda não foi configurado. Adicione os segredos de administração na Cloudflare.')
    }
  }
  useEffect(() => { load().then(applyData).catch(() => setError('Não foi possível carregar a administração.')).finally(() => setLoading(false)) }, [])

  async function action(payload: Record<string, unknown>) {
    setBusy(true); setError(''); setMessage('')
    try {
      const response = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json() as ApiResponse
      if (!response.ok) {
        if (response.status === 401 && payload.action !== 'login') setAuthenticated(false)
        throw new Error(data.error || 'Não foi possível concluir o pedido.')
      }
      setMessage(data.message || '')
      if (payload.action === 'login') { setLoginPassword(''); applyData(await load()) }
      if (payload.action === 'logout') { setAuthenticated(false); setSaved(false); setPassword(''); setHasPassword(false) }
      if (payload.action === 'save') { setPassword(''); setSaved(true); setHasPassword(true) }
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível concluir o pedido.') }
    finally { setBusy(false) }
  }
  const update = (change: Partial<Settings>) => { setSettings(current => ({ ...current, ...change })); setSaved(false) }

  return (
    <section className="px-4 py-12 sm:px-6">
      <div className={`mx-auto ${authenticated && tab === 'inbox' ? 'max-w-6xl' : 'max-w-2xl'} rounded-xl border border-border bg-card p-6 shadow-soft sm:p-10`}>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">Administração</h1>
        {error && <p role="alert" className="mt-6 rounded-lg border border-destructive p-4 text-sm text-destructive">{error}</p>}
        {message && <p role="status" className="mt-6 rounded-lg bg-secondary p-4 text-sm text-primary">{message}</p>}
        {loading ? <p className="mt-6" role="status">A carregar…</p> : !authenticated ? (
          <form className="mt-8 space-y-4" onSubmit={(event: FormEvent) => { event.preventDefault(); void action({ action: 'login', password: loginPassword }) }}>
            <label className="block text-sm font-medium" htmlFor="admin-password">Password de administração</label>
            <Input id="admin-password" type="password" required autoComplete="current-password" value={loginPassword} onChange={event => setLoginPassword(event.target.value)} disabled={busy} />
            <button className={buttonClass} disabled={busy}>{busy ? 'A entrar…' : 'Entrar'}</button>
          </form>
        ) : (
          <>
            <nav aria-label="Administração" className="mt-6 flex flex-wrap gap-3">
              <button className={buttonClass} aria-pressed={tab === 'inbox'} onClick={() => setTab('inbox')}>Mensagens</button>
              <button className={buttonClass} aria-pressed={tab === 'settings'} onClick={() => setTab('settings')}>Configurações de email</button>
              <button className="text-sm underline" disabled={busy} onClick={() => void action({ action: 'logout' })}>Terminar sessão</button>
            </nav>
            {tab === 'inbox' ? <AdminInbox /> : <>
            <form className="mt-8 space-y-5" onSubmit={(event: FormEvent) => { event.preventDefault(); void action({ action: 'save', ...settings, password }) }}>
              <fieldset disabled={busy} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="mb-2 block text-sm font-medium" htmlFor="smtp-host">Servidor SMTP</label><Input id="smtp-host" value="smtp.gmail.com" readOnly /></div>
                  <div><label className="mb-2 block text-sm font-medium" htmlFor="smtp-port">Porta / segurança</label><Input id="smtp-port" value="465 · SSL/TLS" readOnly /></div>
                </div>
                <div><label className="mb-2 block text-sm font-medium" htmlFor="smtp-user">Conta Gmail / remetente</label><Input id="smtp-user" type="email" required value={settings.username} onChange={event => update({ username: event.target.value })} /></div>
                <div>
                  <label className="mb-2 block text-sm font-medium" htmlFor="smtp-password">Password de aplicação do Google</label>
                  <Input id="smtp-password" type="password" autoComplete="new-password" required={!hasPassword} value={password} onChange={event => { setPassword(event.target.value); setSaved(false) }} placeholder={hasPassword ? 'Deixe vazio para manter a password guardada' : 'Password de aplicação com 16 caracteres'} />
                  <p className="mt-2 text-xs text-muted-foreground">Use uma password de aplicação, não a password normal do Gmail. É guardada cifrada e nunca é devolvida à página.</p>
                </div>
                <div><label className="mb-2 block text-sm font-medium" htmlFor="smtp-recipient">Receber notificações em</label><Input id="smtp-recipient" type="email" required value={settings.recipient} onChange={event => update({ recipient: event.target.value })} /></div>
                <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={settings.enabled} onChange={event => update({ enabled: event.target.checked })} /> Ativar notificações por email</label>
                <button className={buttonClass} disabled={busy}>{busy ? 'A processar…' : 'Guardar configurações'}</button>
              </fieldset>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6">
              <button className={buttonClass} disabled={busy || !saved || !settings.enabled} onClick={() => void action({ action: 'test' })}>Enviar email de teste</button>
              <button className="text-sm font-semibold text-primary underline underline-offset-4" disabled={busy} onClick={() => void action({ action: 'logout' })}>Terminar sessão</button>
            </div>
            {!saved && <p className="mt-3 text-xs text-muted-foreground">Guarde as configurações antes de enviar o teste.</p>}
            </>}
          </>
        )}
      </div>
    </section>
  )
}
