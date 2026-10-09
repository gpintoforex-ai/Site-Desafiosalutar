import { getCloudflareContext } from '@opennextjs/cloudflare'

export function runtimeEnv(name: string): string {
  try {
    const value = (getCloudflareContext().env as unknown as Record<string, unknown>)[name]
    if (typeof value === 'string') return value
  } catch {
    // Node.js scripts and local development use process.env.
  }
  return process.env[name] || ''
}
