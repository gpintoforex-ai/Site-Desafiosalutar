'use client'

import { useEffect } from 'react'

export function ChatWidget() {
  useEffect(() => {
    // Avoid double-loading
    if (document.getElementById('ds-chat-widget-sdk')) return
    const script = document.createElement('script')
    script.id = 'ds-chat-widget-sdk'
    script.src = 'https://api.abacus.ai/api/v0/getChatBotWidgetSDKLink?externalApplicationId=16dbf1419e'
    script.async = true
    document.body.appendChild(script)
    return () => {
      // Cleanup on unmount (unlikely in layout but good practice)
      const el = document.getElementById('ds-chat-widget-sdk')
      if (el) el.remove()
    }
  }, [])

  return null
}
