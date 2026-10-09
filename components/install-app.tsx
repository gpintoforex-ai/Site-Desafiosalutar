'use client'

import { useEffect, useState } from 'react'
import { Download, Smartphone, X } from 'lucide-react'

type InstallEvent = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
const DISMISSED = 'ds-install-dismissed-until'

export function InstallApp() {
  const [visible, setVisible] = useState(false)
  const [prompt, setPrompt] = useState<InstallEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [help, setHelp] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)')
    const installed = () => standalone.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    const canShow = () => {
      if (installed()) return false
      try { return Number(localStorage.getItem(DISMISSED) || 0) <= Date.now() } catch { return true }
    }
    const show = () => {
      if (canShow()) {
        setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
        setVisible(true)
      }
    }
    const timer = window.setTimeout(show, 5000)
    const beforeInstall = (event: Event) => { event.preventDefault(); setPrompt(event as InstallEvent); show() }
    const onInstalled = () => { setVisible(false); setPrompt(null) }
    const onDisplayChange = () => { if (installed()) onInstalled() }
    window.addEventListener('beforeinstallprompt', beforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    standalone.addEventListener('change', onDisplayChange)
    return () => { clearTimeout(timer); window.removeEventListener('beforeinstallprompt', beforeInstall); window.removeEventListener('appinstalled', onInstalled); standalone.removeEventListener('change', onDisplayChange) }
  }, [])
  function dismiss() {
    setVisible(false)
    try { localStorage.setItem(DISMISSED, String(Date.now() + 7 * 24 * 60 * 60 * 1000)) } catch { /* Private browsing may disable storage. */ }
  }
  async function install() {
    if (!prompt) { setHelp(true); return }
    setBusy(true)
    try {
      await prompt.prompt()
      const choice = await prompt.userChoice
      if (choice.outcome === 'accepted') setVisible(false)
      else dismiss()
    } catch { setHelp(true) }
    finally { setPrompt(null); setBusy(false) }
  }
  if (!visible) return null
  return <aside aria-label="Instalar app Desafio Salutar" className="fixed right-4 top-28 z-40 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-leaf/30 bg-card p-5 shadow-lift sm:top-32">
    <button aria-label="Fechar convite de instalação" onClick={dismiss} disabled={busy} className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground hover:bg-secondary"><X className="h-4 w-4" /></button>
    <div className="flex items-center gap-3 pr-8"><Smartphone className="h-8 w-8 shrink-0 text-leaf" /><h2 className="text-lg font-semibold text-primary">Tenha a Desafio Salutar sempre à mão</h2></div>
    <p className="mt-3 text-sm text-muted-foreground">Adicione a nossa app ao seu dispositivo para aceder ao site com um toque.</p>
    {help && <p role="status" className="mt-3 rounded-lg bg-secondary p-3 text-sm">{ios ? 'No Safari, toque em Partilhar e depois em “Adicionar ao ecrã principal”. Confirme em “Adicionar”.' : 'Abra o menu do navegador e procure “Instalar app” ou “Adicionar ao ecrã principal”. Se a opção não aparecer, experimente abrir este site no Chrome ou Edge.'}</p>}
    <div className="mt-4 flex flex-wrap items-center gap-4"><button disabled={busy} onClick={() => void install()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-leaf disabled:opacity-50"><Download className="h-4 w-4" />{busy ? 'A abrir…' : prompt ? 'Instalar app' : 'Como instalar'}</button><button disabled={busy} onClick={dismiss} className="text-sm text-muted-foreground underline">Agora não</button></div>
  </aside>
}
