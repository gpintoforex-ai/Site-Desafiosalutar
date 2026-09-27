'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cookie, Settings2, ShieldCheck, X } from 'lucide-react'
import { OPEN_SETTINGS_EVENT, readConsent, saveConsent } from '@/lib/consent'

type Prefs = { functional: boolean; analytics: boolean; marketing: boolean }

const CATEGORIES: { key: keyof Prefs | 'necessary'; title: string; text: string }[] = [
  {
    key: 'necessary',
    title: 'Estritamente necessários',
    text: 'Indispensáveis ao funcionamento do site e à memorização das suas preferências de cookies. Não podem ser desativados.',
  },
  {
    key: 'functional',
    title: 'Funcionais',
    text: 'Permitem funcionalidades de terceiros, como o mapa do Google Maps na página de contactos.',
  },
  {
    key: 'analytics',
    title: 'Analíticos',
    text: 'Ajudam-nos a compreender, de forma agregada, como o site é utilizado. Actualmente não utilizamos ferramentas analíticas.',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    text: 'Utilizados para apresentar conteúdos personalizados. Actualmente não utilizamos cookies de marketing.',
  },
]

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ functional: false, analytics: false, marketing: false })

  useEffect(() => {
    const existing = readConsent()
    if (!existing) setVisible(true)
    else setPrefs({ functional: existing.functional, analytics: existing.analytics, marketing: existing.marketing })

    const onOpen = () => {
      const c = readConsent()
      if (c) setPrefs({ functional: c.functional, analytics: c.analytics, marketing: c.marketing })
      setShowSettings(true)
      setVisible(true)
    }
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen)
  }, [])

  const finish = (p: Prefs) => {
    saveConsent(p)
    setPrefs(p)
    setVisible(false)
    setShowSettings(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookies-titulo"
          aria-describedby="cookies-descricao"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-xl bg-card p-5 text-card-foreground shadow-lift sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary sm:flex">
              <Cookie className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h2 id="cookies-titulo" className="text-xl font-semibold text-primary">
                  Utilizamos cookies
                </h2>
                {showSettings && (
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    aria-label="Fechar preferências"
                    className="rounded-md p-1 text-muted-foreground hover:bg-secondary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p id="cookies-descricao" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Utilizamos cookies estritamente necessários ao funcionamento do site e, com o seu consentimento, cookies
                opcionais. Pode aceitar, recusar ou escolher por categoria. Saiba mais na nossa{' '}
                <Link href="/politica-privacidade#cookies" className="font-medium text-leaf underline underline-offset-2">
                  Política de Privacidade
                </Link>
                .
              </p>

              {showSettings && (
                <ul className="mt-4 max-h-[45vh] space-y-2 overflow-y-auto pr-1">
                  {CATEGORIES.map((c) => {
                    const locked = c.key === 'necessary'
                    const checked = locked ? true : prefs[c.key as keyof Prefs]
                    const id = `cookie-${c.key}`
                    return (
                      <li key={c.key} className="flex items-start justify-between gap-4 rounded-lg bg-secondary p-3">
                        <div>
                          <label htmlFor={id} className="text-sm font-semibold text-primary">
                            {c.title}
                          </label>
                          <p className="text-xs leading-relaxed text-muted-foreground">{c.text}</p>
                        </div>
                        <button
                          id={id}
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          disabled={locked}
                          onClick={() =>
                            !locked && setPrefs((p) => ({ ...(p ?? {}), [c.key]: !p?.[c.key as keyof Prefs] }) as Prefs)
                          }
                          className={`relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                            checked ? 'bg-leaf' : 'bg-input'
                          } ${locked ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                          <span className="sr-only">{c.title}</span>
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform ${
                              checked ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => finish({ functional: true, analytics: true, marketing: true })}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-leaf"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Aceitar todos
                </button>
                <button
                  type="button"
                  onClick={() => finish({ functional: false, analytics: false, marketing: false })}
                  className="inline-flex items-center justify-center rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-muted"
                >
                  Recusar opcionais
                </button>
                {showSettings ? (
                  <button
                    type="button"
                    onClick={() => finish(prefs)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
                  >
                    Guardar preferências
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary underline-offset-2 transition hover:bg-secondary"
                  >
                    <Settings2 className="h-4 w-4" aria-hidden="true" /> Gerir preferências
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
