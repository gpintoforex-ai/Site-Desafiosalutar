'use client'

import { Cookie } from 'lucide-react'
import { openCookieSettings } from '@/lib/consent'

export function ManageCookiesButton({ className = '', label = 'Gerir cookies' }: { className?: string; label?: string }) {
  return (
    <button type="button" onClick={() => openCookieSettings()} className={`inline-flex items-center gap-1.5 ${className}`}>
      <Cookie className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  )
}
