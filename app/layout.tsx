import "./globals.css"

export const metadata = {
  title: "YiSA-S | Patron Paneli",
  description: "YiSA-S Spor Tesisleri Yonetim Sistemi - Patron Paneli",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
