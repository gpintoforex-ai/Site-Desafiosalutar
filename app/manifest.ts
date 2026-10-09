import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/', name: 'Desafio Salutar', short_name: 'Desafio Salutar',
    description: 'Produtos naturais, suplementação e aconselhamento da Desafio Salutar.',
    lang: 'pt-PT', start_url: '/', scope: '/', display: 'standalone',
    background_color: '#ffffff', theme_color: '#65b518',
    icons: [
      { src: '/app-icon-192.png?v=6', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/app-icon-512.png?v=6', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
