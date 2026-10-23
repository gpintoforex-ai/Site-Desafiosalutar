export type CookieConsent = {
  version: 2
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

export const CONSENT_KEY = 'nv-cookie-consent-v2'
export const CONSENT_EVENT = 'nv-cookie-consent-updated'
export const OPEN_SETTINGS_EVENT = 'nv-open-cookie-settings'
let volatileConsent: CookieConsent | undefined

export function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  if (volatileConsent) return volatileConsent
  try {
    const raw = window.localStorage?.getItem?.(CONSENT_KEY)
    if (!raw || raw.length > 4096) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsent>
    if (parsed?.version !== 2 || parsed.necessary !== true || typeof parsed.functional !== 'boolean' || typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean' || typeof parsed.updatedAt !== 'string' || !Number.isFinite(Date.parse(parsed.updatedAt))) return null
    return {
      version: 2,
      necessary: true,
      functional: parsed.functional,
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt,
    }
  } catch {
    return null
  }
}

export function saveConsent(c: Pick<CookieConsent, 'functional' | 'analytics' | 'marketing'>) {
  if (typeof window === 'undefined') return
  const value: CookieConsent = { version: 2, necessary: true, functional: c.functional === true, analytics: c.analytics === true, marketing: c.marketing === true, updatedAt: new Date().toISOString() }
  try {
    window.localStorage?.setItem?.(CONSENT_KEY, JSON.stringify(value))
    volatileConsent = undefined
    window.localStorage?.removeItem?.('nv-cookie-consent-v1')
  } catch {
    volatileConsent = value
    try { window.localStorage?.removeItem?.(CONSENT_KEY) } catch { /* Remain conservative in this document if storage is blocked. */ }
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

export function openCookieSettings() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))
}
