'use client'

import { useSyncExternalStore } from 'react'
import { MapPin } from 'lucide-react'
import { CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent'
import { SITE } from '@/lib/site'

function subscribeToConsent(onUpdate: () => void) {
  window.addEventListener(CONSENT_EVENT, onUpdate)
  window.addEventListener('storage', onUpdate)
  return () => {
    window.removeEventListener(CONSENT_EVENT, onUpdate)
    window.removeEventListener('storage', onUpdate)
  }
}

const readFunctionalConsent = () => Boolean(readConsent()?.functional)
const serverConsent = () => false

export function MapEmbed() {
  const allowed = useSyncExternalStore(subscribeToConsent, readFunctionalConsent, serverConsent)

  const enable = () => {
    const c = readConsent()
    saveConsent({ functional: true, analytics: Boolean(c?.analytics), marketing: Boolean(c?.marketing) })
  }

  const src = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted shadow-soft md:aspect-auto md:h-full md:min-h-[380px]">
      {allowed ? (
        <iframe
          title={`Mapa com a localização da ${SITE.name}`}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="leaf-pattern absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="max-w-sm text-sm text-foreground/80">
            O mapa é fornecido pelo Google Maps e pode instalar cookies de terceiros. Para o visualizar, ative os cookies funcionais.
          </p>
          <button
            type="button"
            onClick={enable}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-leaf"
          >
            Ativar e mostrar mapa
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-leaf underline underline-offset-2"
          >
            Abrir no Google Maps<span className="sr-only"> (abre numa nova janela)</span>
          </a>
        </div>
      )}
    </div>
  )
}
