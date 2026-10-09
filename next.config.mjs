import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

initOpenNextCloudflareForDev()

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: process.env.NEXT_OUTPUT_MODE ? path.join(__dirname, '../') : __dirname,
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  // Next.js traces the default export; Workers need the additional socket files.
  outputFileTracingIncludes: {
    '/*': ['./node_modules/pg-cloudflare/dist/**/*', './node_modules/pg-cloudflare/esm/**/*'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  // Next 16 blocks unlisted development origins, including the HMR WebSocket.
  allowedDevOrigins: ['127.0.0.1', '140ddf3051.na122.preview.abacusai.app'],
}

const userConfigPath = path.join(__dirname, 'next.config.user.json')
const userConfigAllowedKeys = { skipTrailingSlashRedirect: 'boolean', trailingSlash: 'boolean' }
if (fs.existsSync(userConfigPath)) {
  const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'))
  for (const key of Object.keys(userConfig)) {
    if (typeof userConfig[key] !== userConfigAllowedKeys[key]) {
      throw new Error(`next.config.user.json: unsupported override "${key}". Supported boolean keys: skipTrailingSlashRedirect, trailingSlash.`)
    }
    nextConfig[key] = userConfig[key]
  }
}

export default nextConfig
