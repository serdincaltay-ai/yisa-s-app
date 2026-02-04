/**
 * Subdomain tabanlı panel tespiti — Seçenek A
 * app.yisa-s.com → Patron
 * franchise.yisa-s.com → Franchise
 * veli.yisa-s.com → Veli
 * www / yisa-s.com → Tanıtım
 */

export type PanelType = 'patron' | 'franchise' | 'veli' | 'www'

const ROOT_DOMAINS = ['yisa-s.com', 'localhost', '127.0.0.1']

export function getPanelFromHost(host: string | null): PanelType {
  if (!host) return 'www'
  const h = host.split(':')[0].toLowerCase()
  if (h.startsWith('app.')) return 'patron'
  if (h.startsWith('franchise.')) return 'franchise'
  if (h.startsWith('veli.')) return 'veli'
  return 'www'
}

/** Panel için varsayılan path */
export const PANEL_DEFAULT_PATH: Record<PanelType, string> = {
  patron: '/dashboard',
  franchise: '/franchise',
  veli: '/veli',
  www: '/',
}

/** Panel için giriş path */
export const PANEL_LOGIN_PATH: Record<PanelType, string> = {
  patron: '/auth/login',
  franchise: '/auth/login',
  veli: '/auth/login',
  www: '/',
}

const APP_BASE = 'https://app.yisa-s.com'

/** Panel için PWA başlangıç URL — www (yisa-s.com) PWA app.yisa-s.com'a açılsın */
export const PANEL_START_URL: Record<PanelType, string> = {
  patron: '/dashboard',
  franchise: '/franchise',
  veli: '/veli',
  www: `${APP_BASE}/dashboard`, // yisa-s.com'dan yüklenirse app.yisa-s.com açılsın
}

/** Panel için PWA uygulama adı */
export const PANEL_PWA_NAME: Record<PanelType, string> = {
  patron: 'YİSA-S Patron Paneli',
  franchise: 'YİSA-S Franchise Paneli',
  veli: 'YİSA-S Veli Paneli',
  www: 'YİSA-S',
}
