import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { getPanelFromHost } from '@/lib/subdomain'

export async function generateMetadata() {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const panel = getPanelFromHost(host)
  const title =
    panel === 'patron'
      ? 'YİSA-S Patron Paneli'
      : panel === 'franchise'
        ? 'YİSA-S Franchise Paneli'
        : panel === 'veli'
          ? 'YİSA-S Veli Paneli'
          : 'YİSA-S'
  return {
    title: `${title} — Yönetici İşletmeci Sporcu Antrenör Sistemi`,
    description:
      panel === 'patron'
        ? 'Patron Komuta Merkezi — Robotlar, onay, franchise'
        : panel === 'franchise'
          ? 'Franchise Paneli — Tesisinizi yönetin'
          : panel === 'veli'
            ? 'Veli Paneli — Çocuk takibi, ödeme'
            : 'YİSA-S Spor Tesisi Yönetim Sistemi',
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: title,
    },
    icons: {
      icon: [
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    },
  }
}

export const viewport = {
  themeColor: '#0891b2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YİSA-S" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="YİSA-S" />
        <meta name="msapplication-TileColor" content="#030508" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
      </head>
      <body className="bg-[#030508] text-white min-h-screen">
        {children}
        <SpeedInsights />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('[PWA] Service Worker kayıtlı:', registration.scope);
                  })
                  .catch(function(error) {
                    console.log('[PWA] Service Worker kaydı başarısız:', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
