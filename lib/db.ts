import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { getCloudflareContext } from '@opennextjs/cloudflare'

type CloudflareBindings = {
  HYPERDRIVE?: { connectionString: string }
}

function getConnectionString() {
  try {
    const env = getCloudflareContext().env as CloudflareBindings
    if (env.HYPERDRIVE?.connectionString) return env.HYPERDRIVE.connectionString
  } catch {
    // Local Next.js development uses the DATABASE_URL from .env.
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('Set DATABASE_URL or configure a Cloudflare Hyperdrive binding.')
  return connectionString
}

export function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: getConnectionString(), maxUses: 1 })
  return new PrismaClient({ adapter })
}
