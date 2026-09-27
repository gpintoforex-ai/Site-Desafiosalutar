export type CookieConsent = {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

export const CONSENT_KEY = 'nv-cookie-consent-v1'
export const CONSENT_EVENT = 'nv-cookie-consent-updated'
export const OPEN_SETTINGS_EVENT = 'nv-open-cookie-settings'

export function readConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage?.getItem?.(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CookieConsent>
    return {
      necessary: true,
      functional: Boolean(parsed?.functional),
      analytics: Boolean(parsed?.analytics),
      marketing: Boolean(parsed?.marketing),
      updatedAt: String(parsed?.updatedAt ?? ''),
    }
  } catch {
    return null
  }
}

export function saveConsent(c: Omit<CookieConsent, 'necessary' | 'updatedAt'>) {
  if (typeof window === 'undefined') return
  const value: CookieConsent = { necessary: true, ...c, updatedAt: new Date().toISOString() }
  try {
    window.localStorage?.setItem?.(CONSENT_KEY, JSON.stringify(value))
  } catch (err) {
    console.error('Não foi possível guardar as preferências de cookies', err)
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

export function openCookieSettings() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))
}
