import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata = {
  title: 'YİSA-S App - Patron Paneli',
  description: 'YİSA-S Yönetim Paneli',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'YİSA-S',
  },
}

export const viewport = {
  themeColor: '#0891b2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YİSA-S" />
      </head>
      <body className="bg-[#030508] text-white min-h-screen">
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
