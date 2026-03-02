import './globals.css'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { getPanelFromHost } from '@/lib/subdomain'
import { getFranchiseSubdomains } from '@/lib/db/franchise-subdomains'
import ChatWidget from '@/components/ChatWidget'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export async function generateMetadata() {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const subdomains = await getFranchiseSubdomains()
  const panel = getPanelFromHost(host, subdomains)
  const title =
    panel === 'patron'
      ? 'YiSA-S Patron Paneli'
      : panel === 'franchise' || panel === 'franchise_site'
        ? 'YiSA-S Franchise Paneli'
        : panel === 'veli'
          ? 'YiSA-S Veli Paneli'
          : 'YiSA-S'
  const description =
    panel === 'patron'
      ? 'Patron Komuta Merkezi — Robotlar, onay kuyrugu, franchise yonetimi'
      : panel === 'franchise' || panel === 'franchise_site'
        ? 'Franchise Paneli — Ogrenci yonetimi, yoklama, aidat takibi'
        : panel === 'veli'
          ? 'Veli Paneli — Cocuk gelisim takibi, odeme, ders programi'
          : 'YiSA-S — Robot yonetimli spor tesisi franchise sistemi. Cimnastik, basketbol, yuzme ve daha fazlasi.'
  return {
    title: `${title} — Yonetici Isletmeci Sporcu Antrenor Sistemi`,
    description,
    keywords: ['YiSA-S', 'spor tesisi yonetimi', 'cimnastik', 'franchise', 'sporcu takip', 'yoklama sistemi', 'veli paneli', 'antrenor paneli'],
    authors: [{ name: 'YiSA-S' }],
    creator: 'YiSA-S',
    publisher: 'YiSA-S',
    openGraph: {
      title: `${title} — Yonetici Isletmeci Sporcu Antrenor Sistemi`,
      description,
      siteName: 'YiSA-S',
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Spor Tesisi Yonetim Sistemi`,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
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
  themeColor: '#22d3ee',
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
    <html lang="tr" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="theme-color" content="#22d3ee" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YİSA-S" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="YİSA-S" />
        <meta name="msapplication-TileColor" content="#22d3ee" />
        <meta name="msapplication-TileImage" content="/icon-192.png" />
      </head>
      <body className={`${inter.className} text-white min-h-screen bg-zinc-950`}>
        {children}
        <Footer />
        <ChatWidget />
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
