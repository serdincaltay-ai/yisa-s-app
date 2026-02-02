import { NextRequest } from 'next/server'
import {
  getPanelFromHost,
  PANEL_START_URL,
  PANEL_PWA_NAME,
} from '@/lib/subdomain'

/** Subdomain'e göre PWA manifest — her panel kendi uygulaması */
export async function GET(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const panel = getPanelFromHost(host)

  const manifest = {
    name: PANEL_PWA_NAME[panel],
    short_name: 'YİSA-S',
    description:
      panel === 'patron'
        ? 'YİSA-S Patron Komuta Merkezi'
        : panel === 'franchise'
          ? 'YİSA-S Franchise Paneli — Tesisinizi yönetin'
          : panel === 'veli'
            ? 'YİSA-S Veli Paneli — Çocuk takibi'
            : 'YİSA-S Spor Tesisi Yönetim Sistemi',
    start_url: PANEL_START_URL[panel],
    scope: '/',
    display: 'standalone',
    background_color: '#030508',
    theme_color: '#0891b2',
    orientation: 'portrait',
    lang: 'tr',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['business', 'productivity'],
  }

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
